"use strict";

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const GroupModel = require("./../models/group.model");
const StatusCodes = require("./../models/StatusCodes");
const UserModel = require("./../models/user.model");

function comparePassword(password, candidatePassword) {
    return new Promise((res, rej) => {
        if (!password) rej(false);
        bcrypt.compare(candidatePassword, password, function (err, isMatch) {
            if (err) rej(err);
            res(isMatch);
        });
    });
}

const UserController = {};

UserController.GetAll = async (req, res) => {
    return res.status(StatusCodes.OK).json({ data: [] });
};
UserController.GetByID = async (req, res) => {
    return res.status(StatusCodes.OK).json({ data: [] });
};
UserController.Auth = async (req, res) => {
    try {
        const verifiedToken = jwt.verify(req.body.token.toString(), 'mySuperSecretKey', { algorithms: 'HS256' });
        const user = await UserModel.findOne({ _id: verifiedToken._id });
        if (!user) return res.status(StatusCodes.ServerError).json({ error: true, message: 'illeagal token bad reqest' });
        else return res.status(StatusCodes.OK).json({ data: user });
    } catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true, message: error.message });
    }
};
UserController.Register = async (req, res) => {
    try {
        const user = req.body;
        const u = await UserModel.findOne({ sEmail: user.sEmail });
        if (u) return res.status(StatusCodes.BadRequest).json({ error: true, message: 'email exists,  try login' });
        const newUser = new UserModel(user);
        await newUser.save();
        const token = jwt.sign({ _id: newUser._id, sFirstName: newUser.sFirstName, sLastName: newUser.sLastName, sEmail: newUser.sEmail }, 'mySuperSecretKey', { algorithm: 'HS256' });
        const userToClient = await UserModel.findOne({ _id: newUser._id });
        return res.status(StatusCodes.OK).json({ data: { token: token, user: userToClient } });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true, message: error.message });
    }
};
UserController.Login = async (req, res) => {
    try {
        const u = req.body;
        const user = await UserModel.findOne({ sEmail: u.sEmail }, '+sPassword');
        if (!user) return res.status(StatusCodes.BadRequest).json({ error: true, message: 'one or more details is incorrect' });
        const isMatch = await comparePassword(user.sPassword, u.sPassword,);
        const userToClient = await UserModel.findOne({ _id: user._id });
        if (isMatch) return res.status(StatusCodes.OK).json({ data: userToClient });
        else return res.status(StatusCodes.BadRequest).json({ error: true, message: 'one or more details is incorrect' });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true, message: error.message });
    }
};
UserController.CreateGroup = async (req, res) => {
    try {
        const group = req.body;
        const newGroup = new GroupModel(group);
        const user = await UserModel.findOne({ _id: group.sAdminID });
        newGroup.aGroupMembersIDs.push(user._id);
        user.aGroupIDs.push(newGroup._id);
        await newGroup.save();
        await user.save();
        return res.status(StatusCodes.OK).json({ data: { user: user, group: newGroup } });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true, message: error.message });
    }
};
UserController.AddAllowedMemberToGroup = async (req, res) => {
    try {
        const { sAdminID, sGroupID, sAllowedUserEmail } = req.body;
        const group = await GroupModel.findOne({ _id: sGroupID });
        if (group.sAdminID === sAdminID) {
            group.aAllowedUsersEmails.push(sAllowedUserEmail);
            await group.save();
            return res.status(StatusCodes.OK).json({ data: group });
        }
        return res.status(StatusCodes.BadRequest).json({ error: true });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true });
    }
};
module.exports = UserController;