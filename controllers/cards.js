const Card = require("../models/card");
const mongoose = require("mongoose");
const db = mongoose.connection;

module.exports.getCards = async (req, res) => {
  const cards = await Card.find({});
  res.status(200).send(cards);
};

module.exports.getCardById = async (req, res) => {
  const cardToDelete = await Card.findById(req.params.cardId);
  if (cardToDelete) {
  res.status(200).send(await cardToDelete);
  } else {
    return res.status(404).send({ message: "Такой карточки нет." });
  }
};

module.exports.createCard = async (req, res) => {
  const {name, link } = req.body
  const card = new Card({name, link, owner: req.user._id});
  res.status(200).send(await card.save());
};

module.exports.deleteCardById = async (req, res) => {
try {
    const cardToDelete = await Card.findById(req.params.cardId);
    if (cardToDelete) {
    res.status(200).send(await db.collections.cards.deleteOne(cardToDelete));
    } else {
      return res.status(404).send({ message: "Такой карточки нет. Нечего удалять" });
    }
} catch (err) {
  res.status(500).send({ message: "произошла ошибка", ...err });
}
};


module.exports.likeCard = async (req, res) => {

  res.status(200).send(await Card.findByIdAndUpdate(req.params.cardId,{ $addToSet: { likes: req.user._id } }, { new: true }));
  /*const card = await Card.findById(req.params.cardId);
  res.status(200).send(card.likes);*/
  // res.status(200).send(await Card.findById(req.params.cardId).likes);

  /*
  console.log('cardId: ' + req.params.cardId);
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)*/
  };


module.exports.dislikeCard = async (req, res) => {

  res.status(200).send(await Card.findByIdAndUpdate(req.params.cardId,{ $pull: { likes: req.user._id } }, { new: true }));
  /*
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
*/
  }

