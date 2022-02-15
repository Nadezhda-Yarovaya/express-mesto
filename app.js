const express = require("express");
const mongoose = require("mongoose");
const router = require('./router');
const dbUrl = "mongodb://localhost:27017/mestodb";

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '62082d869a9cd2741915c6ec' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

//app.use(express.json());
app.use('/', router);

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
