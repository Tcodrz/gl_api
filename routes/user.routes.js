"use strict";

const express = require("express");
const UserController = require("../controllers/user.controller");
const UsersRouter = express.Router();

UsersRouter.get('', UserController.GetAll);
UsersRouter.get('/:id', UserController.GetByID);
UsersRouter.post('/login', UserController.Login);
UsersRouter.post('/register', UserController.Register);
UsersRouter.post('/new-group', UserController.CreateGroup);
UsersRouter.post('/add-group-member', UserController.AddAllowedMemberToGroup);
UsersRouter.post('/auth', UserController.Auth);

module.exports = UsersRouter; // export users router