"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsonwebtoken = require("jsonwebtoken");
var _config = require("../config");
const generateJWT = id => {
  return (0, _jsonwebtoken.sign)({
    user_id: id
  }, _config.config.jwt.secret, {
    expiresIn: _config.config.jwt.exp
  });
};
var _default = {
  generateJWT
};
exports.default = _default;