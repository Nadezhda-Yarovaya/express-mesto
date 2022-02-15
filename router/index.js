const express = require("express");
const routes = express.Router();
const {usersRouter} = require('./users.js');
const {cardsRouter} = require('./cards.js');

routes.use('/', usersRouter);
routes.use('/', cardsRouter);
module.exports = routes;