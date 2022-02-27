const express = require("express");

const notFoundRouter = express.Router();
const { auth } = require("../middlewares/auth");

const { NotFoundError } = require("../errors/NotFoundError");

notFoundRouter.all("*", auth, (req, res, next) => {
  next(new NotFoundError("Несуществующий запрос"));
});

exports.notFoundRouter = notFoundRouter;
