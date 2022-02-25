const express = require("express");

const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const router = require("./routes");

const { createUser, login } = require("./controllers/users");

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use("/", router);

app.post("/register", express.json(), createUser);
app.post("/auth", express.json(), login);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
