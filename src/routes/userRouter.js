import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import userService from "../bl/userService";

const router = express.Router();

router.put(
  "/create",
  check("email").isEmail().withMessage("Not an email"),
  check(["email", "password", "firstName", "lastName"])
    .exists()
    .withMessage("one of the fields does not exists")
    .isString()
    .withMessage("one of the fields is not a string"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }

    const body = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    try {
      const result = await userService.createUser(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/login",
  check("email").isEmail().withMessage("Not an email"),
  check(["email", "password"])
    .exists()
    .withMessage("one of the fields does not exists")
    .isString()
    .withMessage("one of the fields is not a string"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }

    const body = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const result = await userService.login(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.get(
  "/getConfig",
  async (req, res) => {
    const body = {
      user_id: req.body.user_id,
    };
    try {
      const result = await userService.getConfig(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);
router.post(
  "/setConfig",
  async (req, res) => {
    const body = {user_id: req.body.user_id ,
      config: {
        grass:  req.body.config.grass,
        mode: req.body.config.mode,
        size: req.body.config.size,
        ground: req.body.config.ground,
        location: req.body.config.location,
        liters_per_minute: req.body.config.liters_per_minute,
        light: req.body.config.light,      
    }
    };
    try {
      const result = await userService.setConfig(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
