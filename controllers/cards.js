const mongoose = require("mongoose");
const Card = require("../models/card");
const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");

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
      //also throw validation error
      res.status(200).send(await card.save());
    } else {
      throw new NotFoundError("Не переданы данные карточки");
    }
  } catch (err) {
    next(err);
  }

  //const ERROR_CODE_SERVER = 500;
  //const ERROR_CODE_REQUEST = 400;

  /*

  try {
    if (Object.keys(req.body).length !== 0) {
      const { name, link } = req.body;
      const card = new Card({ name, link, owner: req.user._id });
      res.status(200).send(await card.save());
    } else {
      throw new NotFoundError("Не переданы данные карточки");
      //  res.status(404).send({ message: "Произошла ошибка сервера 404" });
    }
  } catch (err) {
   if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Ошибка валидации" });
    }
res.status(500).send({ message: "Произошла ошибка сервера" });
  }
  }*/
};

module.exports.deleteCardById = async (req, res, next) => {
  //const ERROR_CODE_SERVER = 500;
  // const ERROR_CODE_REQUEST = 400;
  //const ERROR_CODE_NOTFOUND = 404;
  /*  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (cardToDelete) {
    } else {
      throw new NotFoundError("Нет карточки с таким id");
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверные данные карточки" });
    }
    //res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
    throw new Error("Нет карточки с таким id");
  }
*/
  /*rewrite with promises for throw */
  Card.findById(req.params.cardId)
    .then((cardToDelete) => {
      if (!cardToDelete) {
        throw new NotFoundError("Нет карточки с таким id");
      }

      if (!cardToDelete.owner.equals(req.user._id)) {
        return res
          .status(401)
          .send({ message: "Нельзя удалять чужие карточки" });
      }

      db.collections.cards
        .deleteOne(cardToDelete)
        .then((deletedCard) => {
          if (!cardToDelete) {
            throw new NotFoundError("Нельзя удалить то, чего нет");
          }

          res.status(200).send(deletedCard);
        })
        .catch(next);
    })
    .catch(next);
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
