const User = require("../models/user");
const mongoose = require("mongoose");
const db = mongoose.connection;

module.exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
};

module.exports.getUserById = async (req, res) => {
  try {
const user = await User.findById(req.params.userId);
console.log('user:' + user);
if (user)
{
  res.status(200).send(user);
} else {
  return res.status(404).send({message: "Запрашиваемый пользователь не найден"});
}
  } catch(err) {
    res.status(500).send({ message: "Ошибка валидации", ...err });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    if (Object.keys(req.body).length !== 0) {
      const newUser = new User(req.body);
      console.log(newUser);
      res.status(200).send(await newUser.save());
    } else {
      return res
        .status(400)
        .send({ message: "Неверно переданы данные пользователя" });
    }
  } catch (err) {
    res.status(500).send({ message: "Ошибка валидации", ...err });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
  const userProfile = await User.findById(req.user._id);
  const newName = req.body.name;
  res.status(200).send(
    await db.collections.users.updateOne(userProfile, {
      $set: {
        name: newName,
      },
    })
  );
  } catch(err) {
    res.status(500).send({ message: "Ошибка валидации", ...err });
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
  const userProfile = await User.findById(req.user._id);
  const newAvatar = req.body.avatar;
  res.status(200).send(
    await db.collections.users.updateOne(userProfile, {
      $set: {
        avatar: newAvatar,
      },
    })
  );
} catch(err) {
  res.status(500).send({ message: "Ошибка валидации", ...err });
}
};
