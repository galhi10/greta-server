import devicesService from "../bl/devicesService";
import SensorStatesMachineService from "../bl/SensorStatesMachineService";
import auth from "../services/auth";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult, header } from "express-validator";
import { Console } from "winston/lib/winston/transports";

const router = express.Router();

router.put(
  "/create",
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
        id: req.body.config.id,
        mode: req.body.config.mode,
        name: req.body.config.name,
        grass: req.body.config.grass,
        size: req.body.config.size,
        ground: req.body.config.ground,
        liters_per_minute: req.body.config.liters_per_minute,
        light: req.body.config.light,
      },
    };
    try {
      const result = await devicesService.createDevice(body);
      res.json({ ok: true, result });
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.get(
  "/getDevicesId",
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
    try {
      const result = await devicesService.getDevicesId(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.delete(
  "/deleteDevice",
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
      id: req.body.id
    };
    try {
      const result = await devicesService.deleteDevice(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/setDevice",
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
      _id: req.body._id,
      user_id: payload.userId,
      config: {
        id: req.body.config.id,
        mode: req.body.config.mode,
        name: req.body.config.name,
        grass: req.body.config.grass,
        size: req.body.config.size,
        ground: req.body.config.ground,
        liters_per_minute: req.body.config.liters_per_minute,
        light: req.body.config.light,
      }
    };
    try {
      const result = await devicesService.setDevice(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/setGroundHumidity",
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }
    const body = {
      sensor_id: req.body.config_id,
      humidity: req.body.humidity,
      state: req.body.state
    }
    console.log(body);
    try {
      const result = await SensorStatesMachineService.setHumidity(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
