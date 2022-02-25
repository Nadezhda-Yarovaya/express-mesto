const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Минимум 2 символа, но получили {VALUE}"],
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: [2, "Минимум 2 символа, но получили {VALUE}"],
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    minlength: [2, "Минимум 2 символа, а получили меньше"],
    match: [
      /^https*:\/\/w?w?w?.?[-:/._~?#+,;=&'()*@!$\w]#?/g,
      "Неверный формат ссылки",
    ],
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    unique: true,
  },
  password: {
    type: String,
    minlength: [2, "Минимум 2 символа, но получили {VALUE}"],
    required: true,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
