const config = require("../../config");
const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
  return jwt.sign(
    {
      user_id: id,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.exp }
  );
};

module.exports = { generateJWT };
