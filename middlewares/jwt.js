const jwt = require("jsonwebtoken");

const { NODE_ENV, JWT_SECRET } = process.env;

function generateToken(payload) {
  return jwt.sign(
    payload,
    NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
    {
      expiresIn: 1000 * 60 * 60 * 24 * 7,
    }
  );
}

module.exports = {
  generateToken,
};
