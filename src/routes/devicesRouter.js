import devicesService from "../bl/devicesService";
import configService from "../bl/configService";
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
      sensor: {
        id: req.body.sensor.id,
        location: req.body.sensor.location,
        model: req.body.sensor.model,
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
      user_id: payload.userId,
      sensor: {
        id: req.body.sensor.id,
        location: req.body.sensor.location,
        model: req.body.sensor.model,
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
      sensor_id: req.body.sensor_id,
      humidity: req.body.humidity
    }
    try {
      const result = await devicesService.setHumidity(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
