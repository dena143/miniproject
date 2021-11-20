// Import jwt
const jwt = require("jsonwebtoken");
// Import env
require("dotenv").config();

// Make function generate token
function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY_JWT);
}

// Make function decode token
function decodeToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY_JWT);
}

module.exports = {
  generateToken,
  decodeToken,
};
