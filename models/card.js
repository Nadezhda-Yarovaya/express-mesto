const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Минимум 2 символа, но получили {VALUE}"],
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    minlength: [2, "Минимум 2 символа, но получили {VALUE}"],
    maxlength: 30,
    match: [
      /^https*:\/\/w?w?w?.?[-:/._~?#+,;=&'()*@!$\w]#?/g,
      "Неверный формат ссылки",
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
