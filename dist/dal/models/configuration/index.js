"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const configurationSchema = new _mongoose.default.Schema({
  user_id: {
    type: String
  },
  grass: {
    type: String
  },
  mode: {
    type: String
  },
  size: {
    type: Number
  },
  ground: {
    type: String
  },
  location: {
    type: String
  },
  liter_per_minute: {
    type: Number
  },
  light: {
    type: String
  }
}, {
  timestamps: true
});
const configurationModel = _mongoose.default.model("configuration", configurationSchema);
var _default = configurationModel;
exports.default = _default;