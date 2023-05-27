import express, { Request, Response, NextFunction, Router } from "express";
import userService from "../bl/irrigationService";
import auth from "../services/auth";
import { check, validationResult, header } from "express-validator";
import weatherApi from "../services/weatherApi";

const router = express.Router();
router.get(
  "/getIrregSec",
  header("Authorization").custom(async (token) => {
    const authorized = auth.authorized(token, ["ADMIN", "USER"]);
    if (authorized.status !== "SUCCESS") {
      return Promise.reject(authorized.msg);
    }
    Promise.resolve();
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }
    const token = auth.getToken(req);
    const payload = auth.decodeTokenWithoutBearer(token);
    const body = {
      user_id: payload.userId,
    };
    try {
      const result = await userService.getIrregSec(body);
      console.log(result);
      res.json(result.schedule);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/pushIrregSec",
  header("Authorization").custom(async (token) => {
    const authorized = auth.authorized(token, ["ADMIN"]);
    if (authorized.status !== "SUCCESS") {
      return Promise.reject(authorized.msg);
    }
    Promise.resolve();
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }
    const token = auth.getToken(req);
    const payload = auth.decodeTokenWithoutBearer(token);
    const body = {
      user_id: payload.userId,
      schedule: {
        date: req.body.date,
        time: req.body.time,
        status: req.body.status,
        humidity: req.body.humidity,
      },
    };
    try {
      const result = await userService.pushIrregSec(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
