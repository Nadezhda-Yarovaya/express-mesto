const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "62082d869a9cd2741915c6ec",
  };

  next();
});

app.use("/", router);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
