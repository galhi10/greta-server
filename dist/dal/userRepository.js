"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _user = _interopRequireDefault(require("./models/user"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function getUserByEmail(_email) {
  return _user.default.findOne({
    email: _email
  });
}
async function getUserById(_user_id) {
  return _user.default.findOne({
    _id: _user_id
  });
}
async function createNewUser(_email, _password, _first_name, _last_name) {
  const userResult = (await _user.default.create({
    email: _email,
    password: _password,
    first_name: _first_name,
    last_name: _last_name
  })).toObject();
  delete userResult.password;
  return userResult;
}
var _default = {
  createNewUser,
  getUserByEmail,
  getUserById
};
exports.default = _default;