const express = require("express");

const cardsRouter = express.Router();

const {
  validateCreateCard,
  validateCardById,
} = require("../middlewares/validators");

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);
cardsRouter.post("/cards", validateCreateCard, createCard);
cardsRouter.delete("/cards/:cardId", validateCardById, deleteCardById);

cardsRouter.put("/cards/:cardId/likes", validateCardById, likeCard);
cardsRouter.delete("/cards/:cardId/likes", validateCardById, dislikeCard);

exports.cardsRouter = cardsRouter;
