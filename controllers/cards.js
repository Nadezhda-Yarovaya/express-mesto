const mongoose = require("mongoose");
const Card = require("../models/card");
const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { OwnerError } = require("../errors/OwnerError");

const db = mongoose.connection;

module.exports.getCards = async (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards.length > 0) {
        res.status(200).send(cards);
      } else {
        throw new NotFoundError("Карточки не найдены");
      }
    })
    .catch(next);
};

module.exports.createCard = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length !== 0) {
      const { name, link } = req.body;
      const card = new Card({ name, link, owner: req.user._id });

      const error = card.validateSync();
      if (error) {
        let pathname = "name";

        if (!error.errors[pathname]) {
          pathname = "link";
        }

        throw new BadRequest(error.errors[pathname].message);
      }

      res.status(200).send(await card.save());
    } else {
      throw new NotFoundError("Не переданы данные карточки");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        throw new NotFoundError("Нет карточки с таким id");
      }
      if (!cardToDelete.owner.equals(req.user._id)) {
        throw new OwnerError("Нельзя удалять чужие карточки");
      }
      db.collections.cards
        .deleteOne(cardToDelete)
        .then((card) => {
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === "CastError") {
            throw new BadRequest("Неверные данные карточки");
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((currentCard) => {
      if (!currentCard) {
        throw new NotFoundError("Запрашиваемая карточка не найдена");
      }

      Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true, runValidators: true }
      )
        .then((card) => {
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === "CastError") {
            throw new BadRequest("Неверные данные карточки");
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((currentCard) => {
      if (!currentCard) {
        throw new NotFoundError("Запрашиваемая карточка не найдена");
      }

      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true, runValidators: true }
      )
        .then((card) => {
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === "CastError") {
            throw new BadRequest("Неверные данные карточки");
          }
        })
        .catch(next);
    })
    .catch(next);
};
