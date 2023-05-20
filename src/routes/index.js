import express from "express";
import user from "./userRouter";
import config from "./configRouter";
import irrigation from "./irrigationRouter";
import devices from "./devicesRouter";
import weatherApi from "./weatherRouter";

const router = express.Router();

router.use("/user", user);
router.use("/config", config);
router.use("/irrigation", irrigation);
router.use("/devices", devices);
router.use("/weatherApi", weatherApi);

router.use((err, req, res, next) => {
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
