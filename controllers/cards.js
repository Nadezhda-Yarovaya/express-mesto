const Card = require("../models/card");
const mongoose = require("mongoose");
const db = mongoose.connection;

module.exports.getCards = async (req, res) => {
  const cards = await Card.find({});
  res.status(200).send(cards);
};

/*
module.exports.getCardById = async (req, res) => {
  const cardToDelete = await Card.findById(req.params.cardId);
  if (cardToDelete) {
    res.status(200).send(await cardToDelete);
  } else {
    return res.status(404).send({ message: "Такой карточки нет." });
  }
};*/

module.exports.createCard = async (req, res) => {
  try {
  const { name, link } = req.body;
  const card = new Card({ name, link, owner: req.user._id });
  res.status(200).send(await card.save());
} catch (err) {
  res.status(500).send({ message: "Ошибка валидации", ...err });
}
};

module.exports.deleteCardById = async (req, res) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);
    if (cardToDelete) {
      res.status(200).send(await db.collections.cards.deleteOne(cardToDelete));
    } else {
      return res
        .status(404)
        .send({ message: "Запрашиваемая карточка не найдена" });
    }
  } catch (err) {
    res.status(500).send({ message: "Ошибка валидации", ...err });
  }
};

module.exports.likeCard = async (req, res) => {
  res
    .status(200)
    .send(
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
    );
};

module.exports.dislikeCard = async (req, res) => {
  res
    .status(200)
    .send(
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
    );
};
