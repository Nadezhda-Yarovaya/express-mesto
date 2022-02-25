const express = require("express");

const usersRouter = express.Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserMe
} = require("../controllers/users");

const { auth } = require("../middlewares/auth");

//const { registerAdmin, authAdmin } = require("../controllers/admins");

usersRouter.get("/users", auth, getUsers);
usersRouter.get("/users/:userId", auth, getUserById);
usersRouter.get("/users/me", auth, getUserMe);
usersRouter.patch("/users/me", express.json(), auth, updateProfile);
usersRouter.patch("/users/me/avatar", express.json(), auth, updateAvatar);

//usersRouter.post("/users", express.json(), createUser);

exports.usersRouter = usersRouter;
