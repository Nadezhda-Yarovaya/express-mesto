const express = require("express");
const notFoundRouter = express.Router();

function processError(req, res) {
  res.status(404).send({ message: "Несуществующий запрос" });
}

notFoundRouter.get("*", processError);
notFoundRouter.post("*", express.json(), processError);
notFoundRouter.patch("*", express.json(), processError);
notFoundRouter.put("*", express.json(), processError);
notFoundRouter.delete("*", processError);

exports.notFoundRouter = notFoundRouter;
