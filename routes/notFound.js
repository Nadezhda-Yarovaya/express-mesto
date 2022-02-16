const express = require("express");

const notFoundRouter = express.Router();

notFoundRouter.all("*", (req, res) => res.status(404).send({ message: "Несуществующий запрос" }));

exports.notFoundRouter = notFoundRouter;
