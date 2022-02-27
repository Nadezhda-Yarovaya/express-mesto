const express = require("express");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

const cookieParser = require("cookie-parser");

const router = require("./routes");

const { auth } = require("./middlewares/auth");

const { createUser, login } = require("./controllers/users");
const { errorHandler } = require("./middlewares/errorHandler");

const { validateUser } = require("./middlewares/validators");

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.post("/signup", validateUser, createUser);
app.post("/signin", validateUser, login);

app.use(cookieParser());
app.use(auth);
app.use("/", router);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
