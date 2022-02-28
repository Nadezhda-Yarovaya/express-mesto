const express = require("express");

const usersRouter = express.Router();

const {
  validateUserById,
  validateProfileData,
  validateProfileAvatar,
} = require("../middlewares/validators");

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

usersRouter.get("/users", getUsers);
usersRouter.get("/users/me", validateProfileData, getCurrentUser);

usersRouter.patch("/users/me", validateProfileData, updateProfile);
usersRouter.patch("/users/me/avatar", validateProfileAvatar, updateAvatar);
usersRouter.get("/users/:userId", validateUserById, getUserById);

exports.usersRouter = usersRouter;
