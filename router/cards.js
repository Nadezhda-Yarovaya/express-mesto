const express = require('express');
const cardsRouter = express.Router();

const { getCards, getCardById, createCard, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards'); /* create*/
cardsRouter.get('/cards', getCards);
cardsRouter.get('/cards/:cardId', getCardById);
cardsRouter.post('/cards', express.json(), createCard);
cardsRouter.delete('/cards/:cardId', deleteCardById);

cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);


exports.cardsRouter = cardsRouter;