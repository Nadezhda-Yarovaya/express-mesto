const express = require("express");
// cors install and use
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const router = require("./routes");

const { createUser, login } = require("./controllers/users");

const { PORT = 3000 } = process.env;

const app = express();

/*
app.use((req, res, next) => {
  req.user = {
    _id: "620b6bbb3cb701aeb503875c",
  };
  next();
});*/

app.use(cookieParser());
app.post("/register", express.json(), createUser);
app.post("/auth", express.json(), login);

app.use("/", router);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
