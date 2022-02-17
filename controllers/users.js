const mongoose = require("mongoose");
const User = require("../models/user");

const db = mongoose.connection;

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
