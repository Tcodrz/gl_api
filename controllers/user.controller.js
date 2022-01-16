"use strict";

const bcrypt = require("bcrypt");
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
UserController.Register = async (req, res) => {
    try {
        const user = req.body;
        const u = await UserModel.findOne({ sEmail: user.sEmail });
        if (u)
            return res.status(StatusCodes.BadRequest).json({ error: true, message: 'email exists,  try login' });
        const newUser = new UserModel(user);
        await newUser.save();
        const userToClient = await UserModel.findOne({ _id: newUser._id });
        return res.status(StatusCodes.OK).json({ data: userToClient });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true, message: 'Could not add user ' });
    }
};
UserController.Login = async (req, res) => {
    try {
        const u = req.body;
        const user = await UserModel.findOne({ sEmail: u.sEmail }, '+sPassword');
        console.log(user);
        if (!user) return res.status(StatusCodes.BadRequest).json({ error: true, message: 'one or more details is incorrect' });
        const isMatch = await comparePassword(user.sPassword, u.sPassword);
        console.log(isMatch);
        const userToClient = await UserModel.findOne({ _id: user._id });
        if (isMatch)
            return res.status(StatusCodes.OK).json({ data: userToClient });
        else
            return res.status(StatusCodes.BadRequest).json({ error: true, message: 'one or more details is incorrect' });
    }
    catch (error) {
        return res.status(StatusCodes.ServerError).json({ error: true });
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