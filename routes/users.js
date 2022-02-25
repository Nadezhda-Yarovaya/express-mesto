const express = require("express");

const usersRouter = express.Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser
} = require("../controllers/users");

const { auth } = require("../middlewares/auth");

//const { registerAdmin, authAdmin } = require("../controllers/admins");

usersRouter.get("/users", auth, getUsers);
usersRouter.get("/users/me", auth, getCurrentUser);
usersRouter.patch("/users/me", express.json(), auth, updateProfile);
usersRouter.patch("/users/me/avatar", express.json(), auth, updateAvatar);
usersRouter.get("/users/:userId", auth, getUserById);

//usersRouter.post("/users", express.json(), createUser);

exports.usersRouter = usersRouter;
