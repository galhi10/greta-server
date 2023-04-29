import configService from "../bl/configService";
import auth from "../services/auth";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult, header } from "express-validator";

const router = express.Router();
router.get(
  "/getConfig",
  header("Authorization")
    .custom(async (token) => {
      const authorized = auth.authorized(token, ["ADMIN"])
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
    console.log(body);
    try {
      const result = await configService.getConfig(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/setConfig",
  header("Authorization")
    .custom(async (token) => {
      const authorized = auth.authorized(token, ["ADMIN"])
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
      config: {
        grass: req.body.config.grass,
        mode: req.body.config.mode,
        size: req.body.config.size,
        ground: req.body.config.ground,
        location: req.body.config.location,
        liters_per_minute: req.body.config.liters_per_minute,
        light: req.body.config.light,
      }
    };
    try {
      const result = await configService.setConfig(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
