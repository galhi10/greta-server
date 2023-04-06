"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));
var _config = require("../config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// DB Connection

console.log(process.env.MONGO_URI, "haha");
_mongoose.default.connect("mongodb+srv://ItamarKfir:1234@itamarkfir.d1awrao.mongodb.net/greta", {}).then(async r => {
  console.log("Successfully connected to DB!");
}).catch(err => {
  console.log(err);
});
_mongoose.default.set("debug", false); // on true -> print to terminal db operations