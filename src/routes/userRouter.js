import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult, header } from "express-validator";
import userService from "../bl/userService";
import auth from "../services/auth";
import configService from "../bl/configService";

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

router.post(
  "/setPassword",
  header("Authorization")
    .custom(async (token) => {
      const authorized = auth.authorized(token, ["ADMIN"])
      if (authorized.status !== "SUCCESS") {
        return Promise.reject(authorized.msg);
      }
      Promise.resolve();
    }),
  check("password").isString().withMessage("Not an valid password"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }
    const token = auth.getToken(req);
    const payload = auth.decodeTokenWithoutBearer(token);
    const body = {
      userid: payload.userId,
      password: req.body.password,
    };
    try {
      const result = await userService.setPassword(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;