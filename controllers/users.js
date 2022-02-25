const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const validator = require("validator");

const User = require("../models/user");

const db = mongoose.connection;

const { generateToken } = require("../middlewares/jwt");

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUND = 10;

module.exports.getUsers = async (req, res) => {
  const ERROR_CODE = 500;
  try {
    const users = await User.find({});
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.send({ message: "Пользователи не найдены" });
    }
  } catch (err) {
    res.status(ERROR_CODE).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.getUserMe = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_NOTFOUND = 404;
  const ERROR_CODE_REQUEST = 400;
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверно переданы данные пользователя" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.getUserById = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_NOTFOUND = 404;
  const ERROR_CODE_REQUEST = 400;
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверно переданы данные пользователя" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};

/*
module.exports.createUser = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  try {
    if (Object.keys(req.body).length !== 0) {
      const newUser = new User(req.body);
      res.status(200).send(await newUser.save());
    } else {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Не переданы данные пользователя" });
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
*/
module.exports.createUser = (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .send({ message: "Электронная почта в неверном формате" });
  }

  bcrypt
    .hash(password, SALT_ROUND)
    .then((hash) => {
      User.create({ email, password: hash })
        .then((createdAdmin) => {
          res.status(201).send(createdAdmin);
        })
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
            return res
              .status(409)
              .send({ message: "Такой пользователь уже существует" });
          }
          res.status(404).send({ message: "mist", ...err });
        }); // user create close
    })
    .catch((err) => {
      res.status(500).send({ message: "mistake 500", ...err });
    }); //bcrypt hash close

  //return here
  /* CREATE USER FROM 13
  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: "Неверная почта - валидатор" });
  }

  if (!email || !password) {
    return res.status(400).send({ message: "Не верный почта или пароль " });
  }*/

  /* ORIGINAL FROM 14 WEBINAR
  bcrypt.hash(password, SALT_ROUND).then((hash) => {
    User.create({ email, password: hash })
      .then((createdAdmin) => {
        res.status(201).send(createdAdmin);
      })
      .catch((err) => {
        console.log(err);
        // doesn't work if unique!! in scheme maybe do
        if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
          return res
            .status(409)
            .send({ message: "Такой пользователь уже существует" });
        }
        if (err.errors.password.name === "ValidatorError") {
          res.status(400).send({ message: "Данные не валидны", error: err });
        }
      });
  }); // close then of bcrypt
  //res.status(200).send("мы в регистрации");
  */
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Не верный email или пароль " });
  }

  User.findOne({ email }).select("+password")
    .orFail(new Error("Пользователь не найден!"))
    .then((currentUser) => {
      /*  if (!admin) {
        return res.status(400).send({ message: "Не верный email или пароль" });
      }*/

      bcrypt
        .compare(password, currentUser.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new Error({ message: "Не верный email или пароль" })
            );
          }

          const token = generateToken({ _id: currentUser._id });

          res.cookie("mestoToken", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });

          res.status(200).send({ message: "Успешная авторизация" });
          /* тут ай ди можно  */
        })
        .catch((err) => {
          res
            .status(401)
            .send({ message: "Не верный email или пароль", ...err });
        });
    })
    .catch((err) => {
      res.status(404).send({ message: err });
    });
};

module.exports.updateProfile = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_NOTFOUND = 404;

  try {
    console.log(`id: ${req.user._id}`);
    const userProfile = await User.findById(req.user._id);
    console.log(`userProfile: ${userProfile}`);
    if (req.body.name) {
      const newName = req.body.name;
      res.status(200).send(
        await db.collections.users.updateOne(userProfile, {
          $set: {
            name: newName,
          },
        })
      );
    } else {
      res.send({ message: "Не переданы данные пользователя" });
    }
  } catch (err) {
    console.log(err.name);
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Ошибка валидации" });
    }
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  const ERROR_CODE_NOTFOUND = 404;
  try {
    if (req.body.avatar) {
      const userProfile = await User.findById(req.user._id);
      const newAvatar = req.body.avatar;
      res.status(200).send(
        await db.collections.users.updateOne(userProfile, {
          $set: {
            avatar: newAvatar,
          },
        })
      );
    } else {
      res.send({ message: "Не переданы данные пользователя" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Ошибка валидации" });
    }
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_NOTFOUND)
        .send({ message: "Запрашиваемый пользователь не найден" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};
