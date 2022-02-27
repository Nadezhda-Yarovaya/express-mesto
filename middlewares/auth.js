const jwt = require("jsonwebtoken");

const { OwnerError } = require("../errors/OwnerError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.mestoToken;

  if (!token) {
    throw new OwnerError("Необходима авторизация");
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    next(new OwnerError("Нет доступа"));
  }
  req.user = payload;

  next();
};
