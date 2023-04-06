"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bcrypt = require("bcrypt");
const encrypt = async password => {
  return await (0, _bcrypt.hash)(password, 10);
};
const decrypt = async (password, encryptedPassword) => {
  return await (0, _bcrypt.compare)(password, encryptedPassword);
};
var _default = {
  encrypt,
  decrypt
};
exports.default = _default;