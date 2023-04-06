"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _password = _interopRequireDefault(require("../utils/password"));
var _userRepository = _interopRequireDefault(require("../dal/userRepository"));
var _errorMessages = require("../utils/errorMessages");
var _auth = _interopRequireDefault(require("../services/auth"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createUser = async body => {
  const user = await _userRepository.default.getUserByEmail(body.email);
  if (user) {
    throw _errorMessages.errorMessages.user.exists;
  }
  body.password = await _password.default.encrypt(body.password.toString());
  return {
    ok: true,
    data: await _userRepository.default.createNewUser(body.email, body.password, body.firstName, body.lastName)
  };
};
const login = async body => {
  const user = await _userRepository.default.getUserByEmail(body.email);
  if (!user) {
    throw _errorMessages.errorMessages.user.badEmailOrPassword;
  }
  const passwordVerified = await _password.default.decrypt(body.password, user.password);
  if (passwordVerified) {
    return {
      ok: true,
      data: {
        token: _auth.default.generateJWT(user._id)
      }
    };
  } else {
    throw _errorMessages.errorMessages.user.badEmailOrPassword;
  }
};
var _default = {
  login,
  createUser
};
exports.default = _default;