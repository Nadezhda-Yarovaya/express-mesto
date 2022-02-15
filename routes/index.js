const express = require("express");
const routes = express.Router();
const { usersRouter } = require("./users.js");
const { cardsRouter } = require("./cards.js");
const { notFoundRouter } = require("./notFound.js");

routes.use("/", usersRouter);
routes.use("/", cardsRouter);
routes.use("*", notFoundRouter);

module.exports = routes;
