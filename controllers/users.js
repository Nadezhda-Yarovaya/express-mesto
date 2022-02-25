//const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const validator = require("validator");

const User = require("../models/user");

//const db = mongoose.connection;

const { generateToken } = require("../middlewares/jwt");

const SALT_ROUND = 10;

const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { AlreadyExistsError } = require("../errors/AlreadyExistsError");
const { WrongDataError } = require("../errors/WrongDataError");

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      throw new NotFoundError("Пользователи не найдены");
    }
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
    .catch(() => {
      throw new BadRequest("Неверные данные");
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  const user = new User(req.body);

  if (!validator.isEmail(email)) {
    throw new BadRequest("Электронная почта в неверном формате");
  }
  const error = user.validateSync();
  if (error) {
    const pathname = "password";
    throw new BadRequest(error.errors[pathname].message);
  }

  bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({ email, password: hash })
        .then((createdUser) => {
          res.status(201).send(createdUser);
        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === "MongoServerError" && err.code === 11000) {
            throw new AlreadyExistsError("Такой пользователь уже существует");
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new WrongDataError("Неверный email или пароль");
  }

  User.findOne({ email })
    .select("+password")
    .orFail(new NotFoundError("Пользователь не найден!"))
    .then((currentUser) => {
      bcrypt
        .compare(password, currentUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new WrongDataError({ message: "Неверный email или пароль" })
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
  if (!req.body.name || !req.body.about) {
    throw new NotFoundError("Не переданы данные пользователя");
  }

  const opts = { runValidators: true };

  User.findById(req.user._id)
    .then((user) => {
      const newName = req.body.name;
      const newAbout = req.body.about;

      User.updateOne(
        {
          _id: user._id,
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
    })

    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  if (!req.body.avatar) {
    throw new NotFoundError("Не переданы данные пользователя");
  }

  const opts = { runValidators: true };

  User.findById(req.user._id)
    .then((user) => {
      const newAvatar = req.body.avatar;

      User.updateOne(
        {
          _id: user._id,
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
    })

    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      throw new BadRequest("Переданы неверные данные ");
    });
};
