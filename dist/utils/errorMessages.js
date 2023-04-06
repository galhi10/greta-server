"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMessages = void 0;
const errorMessages = {
  user: {
    notExist: {
      status: 400,
      message: "User does not exists"
    },
    exists: {
      status: 400,
      message: "The user already exists"
    },
    badEmailOrPassword: {
      status: 400,
      message: "Bad email or password"
    }
  }
};
exports.errorMessages = errorMessages;