const express = require('express');
const usersRouter = express.Router();

const { getUsers, getUserById, createUser, updateProfile, updateAvatar } = require('../controllers/users');
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.post('/users', express.json(), createUser);
usersRouter.patch('/users/me', express.json(), updateProfile);
usersRouter.patch('/users/me/avatar', express.json(), updateAvatar);

exports.usersRouter = usersRouter;
