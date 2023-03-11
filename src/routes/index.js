import express from "express";
import users from "./userRouter";
const router = express.Router();

router.use("/user", users);

router.use((err, req, res, next) => {
  // console.log(err);

  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  } else if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: status.error,
      errors: err.code,
    });
  }

  return next(err);
});

module.exports = router;
