const User = require("../models/user");
const mongoose = require("mongoose");
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
    if (
      res
        .status(ERROR_CODE_SERVER)
        .send({ message: "Произошла ошибка сервера" })
    );
  }
};

module.exports.createUser = async (req, res) => {
  const ERROR_CODE_SERVER = 500;
  const ERROR_CODE_REQUEST = 400;
  try {
    if (Object.keys(req.body).length !== 0) {
      const newUser = new User(req.body);
      console.log(newUser);
      res.status(200).send(await newUser.save());
    } else {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверно переданы данные пользователя" });
    }
  } catch (err) {
    if (err.errors.name.name === "ValidatorError") {
      return res
        .status(ERROR_CODE_SERVER)
        .send({ message: "Ошибка валидации" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    if (req.body.name) {
      const userProfile = await User.findById(req.user._id);
      const newName = req.body.name;
      res.status(200).send(
        await db.collections.users.updateOne(userProfile, {
          $set: {
            name: newName,
          },
        })
      );
    } else {
      res.send({ message: "Неверно переданы данные пользователя" });
    }
  } catch (err) {
    res.status(500).send({ message: "Произошла ошибка сервера" });
  }
};

module.exports.updateAvatar = async (req, res) => {
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
      res.send({ message: "Неверно переданы данные пользователя" });
    }
  } catch (err) {
    res.status(500).send({ message: "Произошла ошибка сервера" });
  }
};
