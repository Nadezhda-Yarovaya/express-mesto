const express = require("express");

const cardsRouter = express.Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);
cardsRouter.post("/cards", express.json(), createCard);
cardsRouter.delete("/cards/:cardId", deleteCardById);

cardsRouter.put("/cards/:cardId/likes", likeCard);
cardsRouter.delete("/cards/:cardId/likes", dislikeCard);

exports.cardsRouter = cardsRouter;
