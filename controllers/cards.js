const mongoose = require("mongoose");
const Card = require("../models/card");
const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { OwnerError } = require("../errors/OwnerError");

const ERROR_CODE_REQUEST = "ValidatorError";

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

        //console.log(`name:  ${error.errors[pathname]}`);
        if (!error.errors[pathname]) {
          pathname = "link";
        }

        throw new BadRequest(error.errors[pathname].message);
      }
      /*
      console.log(card);
      const error = card.validateSync();

      console.log(`error namme: ${error.errors}`);*/

      /*   if (error.errors["link"].name === ERROR_CODE_REQUEST) {
        throw new BadRequest("Ошибка валидации");
      }*/

      /*      let error = card.validateSync();
      assert.equal(error.errors['link'].message,'Too few eggs');
      assert.ok(!error.errors['link']);*/
      /* console.log(
        `error: ${Object.entries(error)} error namme: ${
          error.errors["link"].name
        }`
      );*/

      /*if (error.errors.link.name === ERROR_CODE_REQUEST) {
        throw new BadRequest("Ошибка валидации");
      }*/

      res.status(200).send(await card.save());
    } else {
      throw new NotFoundError("Не переданы данные карточки");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);

    if (!cardToDelete) {
      throw new NotFoundError("Нет карточки с таким id");
    }
    if (!cardToDelete.owner.equals(req.user._id)) {
      throw new OwnerError("Нельзя удалять чужие карточки");
    }
    /* request 400 also make */
    res.status(200).send(await db.collections.cards.deleteOne(cardToDelete));
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
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
      throw new NotFoundError("Запрашиваемая карточка не найдена");
    }
  } catch (err) {
    next(err);
    /*
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверные данные карточки" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
  }*/
  }
};

module.exports.dislikeCard = async (req, res, next) => {
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
      throw new NotFoundError("Запрашиваемая карточка не найдена");
    }
  } catch (err) {
    next(err);
    /*
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_REQUEST)
          .send({ message: "Неверные данные карточки" });
      }
      res.status(ERROR_CODE_SERVER).send({ message: "Ошибка валидации" });
    }*/
  }
};
