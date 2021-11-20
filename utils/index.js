const { generateToken, decodeToken } = require("./jwt");
const { encodePin, compare } = require("./bcrypt");

module.exports = {
  compare,
  encodePin,
  generateToken,
  decodeToken,
};
