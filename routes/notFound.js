const express = require("express");

const notFoundRouter = express.Router();
const { auth } = require("../middlewares/auth");

notFoundRouter.all("*", auth, (req, res) => res.status(404).send({ message: "Несуществующий запрос" }));

exports.notFoundRouter = notFoundRouter;
