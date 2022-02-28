const bcrypt = require("bcrypt");

const User = require("../models/user");

const { generateToken } = require("../middlewares/jwt");

const SALT_ROUND = 10;

const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { AlreadyExistsError } = require("../errors/AlreadyExistsError");
const { OwnerError } = require("../errors/OwnerError");

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Неверные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar
  } = req.body;
  bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((createdUser) => {
          res.status(201).send({
            data: {
              name: createdUser.name,
              about: createdUser.about,
              avatar: createdUser.avatar,
              email: createdUser.email,
            },
          });
        })
        .catch((err) => {
          if (err.name === "MongoServerError" && err.code === 11000) {
            next(new AlreadyExistsError("Такой пользователь уже существует"));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .orFail(new OwnerError("Пользователь не найден!"))
    .then((currentUser) => {
      bcrypt
        .compare(password, currentUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new OwnerError({ message: "Неверный email или пароль" })
            );
          }
          const token = generateToken({ _id: currentUser._id });
          res.cookie("mestoToken", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });

          res.status(200).send({ message: "Успешная авторизация" });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const opts = { new: true, runValidators: true };
  const newName = req.body.name;
  const newAbout = req.body.about;

  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $set: {
        name: newName,
        about: newAbout,
      },
    },
    opts
  )
    .then((updated) => {
      res.status(200).send(updated);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const opts = { new: true, runValidators: true };
  const newAvatar = req.body.avatar;
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $set: {
        avatar: newAvatar,
      },
    },
    opts
  )
    .then((updated) => {
      res.status(200).send(updated);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
