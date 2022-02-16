const express = require("express");

const routes = express.Router();
const { usersRouter } = require("./users");
const { cardsRouter } = require("./cards");
const { notFoundRouter } = require("./notFound");

routes.use("/", usersRouter);
routes.use("/", cardsRouter);
routes.use("*", notFoundRouter);

module.exports = routes;
