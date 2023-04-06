"use strict";

var _express = _interopRequireDefault(require("express"));
var _userRouter = _interopRequireDefault(require("./userRouter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const router = _express.default.Router();
router.use("/user", _userRouter.default);
router.use((err, req, res, next) => {
  // console.log(err);

  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  } else if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: status.error,
      errors: err.code
    });
  }
  return next(err);
});
module.exports = router;