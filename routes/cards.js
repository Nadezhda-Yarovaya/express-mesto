const express = require("express");

const cardsRouter = express.Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const { auth } = require("../middlewares/auth");

//const { errorHandling } = require("../middlewares/errorHandling");

cardsRouter.get("/cards", auth, getCards);
cardsRouter.post("/cards", express.json(), auth, createCard);
cardsRouter.delete("/cards/:cardId", auth, deleteCardById);

cardsRouter.put("/cards/:cardId/likes", auth, likeCard);
cardsRouter.delete("/cards/:cardId/likes", auth, dislikeCard);

exports.cardsRouter = cardsRouter;
