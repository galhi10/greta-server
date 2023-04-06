"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const irrigationScheduleSchema = new _mongoose.default.Schema({
  user_id: {
    type: String
  },
  schedule: {
    type: Array
  }
}, {
  timestamps: true
});
const irrigationScheduleModel = _mongoose.default.model("irrigation_schedule", irrigationScheduleSchema);
var _default = irrigationScheduleModel;
exports.default = _default;