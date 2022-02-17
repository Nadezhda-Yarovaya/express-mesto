const mongoose = require("mongoose");
const Card = require("../models/card");

const db = mongoose.connection;

module.exports.getCards = async (req, res) => {
  const ERROR_CODE = 500;
  try {
    const cards = await Card.find({});
    if (cards.length > 0) {
      res.status(200).send(cards);
    } else {
      res.send({ message: "Карточки не найдены" });
    }
  } catch (err) {
    res.status(ERROR_CODE).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.createCard = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  try {
    if (Object.keys(req.body).length !== 0) {
      const { name, link } = req.body;
      const card = new Card({ name, link, owner: req.user._id });
      res.status(200).send(await card.save());
    } else {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Не переданы данные карточки" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Ошибка валидации" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.deleteCardById = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_NOTFOUND = 404;
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (cardToDelete) {
      res.status(200).send(await db.collections.cards.deleteOne(cardToDelete));
    } else {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемая карточка не найдена" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверные данные карточки" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
  }
};

module.exports.likeCard = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_NOTFOUND = 404;

  try {
    const currentCard = await Card.findById(req.params.cardId);
    if (currentCard) {
      res
        .status(200)
        .send(
          await Card.findByIdAndUpdate(
            req.params.cardId,
            { $addToSet: { likes: req.user._id } },
            { new: true }
          )
        );
    } else {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверные данные карточки" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_NOTFOUND = 404;
  try {
    const currentCard = await Card.findById(req.params.cardId);
    if (currentCard) {
      res
        .status(200)
        .send(
          await Card.findByIdAndUpdate(
            req.params.cardId,
            { $pull: { likes: req.user._id } },
            { new: true }
          )
        );
    } else {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемая карточка не найдена" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверные данные карточки" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
  }
};
