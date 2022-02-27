const Card = require("../models/card");
const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { OwnerError } = require("../errors/OwnerError");
const { AlreadyExistsError } = require("../errors/OwnerError");

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    console.log(req.body);
    if (Object.keys(req.body).length === 0) {
      throw new NotFoundError("Не переданы данные карточки");
    }
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });

    res.status(200).send(await card.save());
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError("Нет карточки с таким id"))
    .then((cardToDelete) => {
      if (!cardToDelete.owner.equals(req.user._id)) {
        return next(new OwnerError("Нельзя удалять чужие карточки"));
      }
      return cardToDelete
        .remove()
        .then(() => res.send({ message: "Карточка удалена" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Неверные данные карточки"));
      } else next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
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
            next(new BadRequest("Неверные данные карточки"));
          } else if (err.name === "MongoServerError" && err.code === 11000) {
            next(new AlreadyExistsError("Такой пользователь уже существует"));
          } else next(err);
        });
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
            next(new BadRequest("Неверные данные карточки"));
          } else if (err.name === "MongoServerError" && err.code === 11000) {
            next(new AlreadyExistsError("Такой пользователь уже существует"));
          } else next(err);
        });
    })
    .catch(next);
};
