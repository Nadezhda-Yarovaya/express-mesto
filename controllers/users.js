const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const validator = require("validator");

const User = require("../models/user");

const db = mongoose.connection;

const { generateToken } = require("../middlewares/jwt");

//const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUND = 10;

const { NotFoundError } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequest");
const { AlreadyExistsError } = require("../errors/AlreadyExistsError");
//const { OwnerError } = require("../errors/OwnerError");

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

module.exports.getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError("Запрашиваемый пользователь не найден");
    }
  } catch (err) {
    next(err);
    /*
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверно переданы данные пользователя" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });*/
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).send(user);
    } else {
      throw new NotFoundError("Запрашиваемый пользователь не найден");
    }
  } catch (err) {
    next(err);
    /*
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODE_REQUEST)
        .send({ message: "Неверно переданы данные пользователя" });
    }
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });
  }*/
  }
};

/*Тела запросов к серверу должны валидироваться до передачи обработки в контроллеры.
Если запрос принимает какую-то информацию в заголовках или параметрах, валидируйте и её
*/

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    throw new BadRequest("Электронная почта в неверном формате");
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
          /*
          if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
            return res
              .status(409)
              .send({ message: "Такой пользователь уже существует" });
          }
          res.status(404).send({ message: "mist", ...err });*/
        }); // user create close
    })
    .catch(next); //bcrypt hash close
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Неверный email или пароль " });
  }

  User.findOne({ email })
    .select("+password")
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
              new Error({ message: "Неверный email или пароль" })
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
          next(err);
          /*
          res
            .status(401)
            .send({ message: "Не верный email или пароль", ...err });
        });
        */
        });
    })
    .catch(next);
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    //console.log(`id: ${req.user._id}`);
    const userProfile = await User.findById(req.user._id);
    //console.log(`userProfile: ${userProfile}`);
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
      throw new NotFoundError("Не переданы данные пользователя");
    }
  } catch (err) {
    next(err);

    /*
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
    */
  }
};

module.exports.updateAvatar = async (req, res, next) => {
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
      throw new NotFoundError("Не переданы данные пользователя");
    }
  } catch (err) {
    next(err);
    /*
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
    res.status(ERROR_CODE_SERVER).send({ message: "Произошла ошибка сервера" });*/
  }
};
