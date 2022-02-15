const User = require("../models/user");
const mongoose = require("mongoose");
const db = mongoose.connection;

module.exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
};

module.exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.status(200).send(user);
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
        .send({ message: "400 ошибка, нет данных в req.body" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateProfile = async (req, res) => {
  const userProfile = await User.findById(req.user._id);
  const newName = req.body.name;
  res.status(200).send(
    await db.collections.users.updateOne(userProfile, {
      $set: {
        name: newName,
      },
    })
  );
};

module.exports.updateAvatar = async (req, res) => {
  const userProfile = await User.findById(req.user._id);
  const newAvatar = req.body.avatar;
  res.status(200).send(
    await db.collections.users.updateOne(userProfile, {
      $set: {
        avatar: newAvatar,
      },
    })
  );
};
