import weatherApi from "../services/weatherApi";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult, header } from "express-validator";

const router = express.Router();

router.post("/getTemp", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 400, ...errors });
  }
  try {
    console.log("🚀 ~ file: weatherRouter.js:17 ~ req.body:", req.body);

    const result = await weatherApi.GetCurrentTemperature(req.params.city);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ ok: false, message: err.message });
  }
});

router.get("/getAirHumidity", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 400, ...errors });
  }
  try {
    const result = await weatherApi.GetAirHumidity(req.body.city);
    res.json(result);
  } catch (err) {
    res.status(err.status).json({ ok: false, message: err.message });
  }
});

router.get("/getCitiesList", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 400, ...errors });
  }
  try {
    const result = await weatherApi.readCitiesFromFile();
    res.json(result);
  } catch (err) {
    res.status(err.status).json({ ok: false, message: err.message });
  }
});

module.exports = router;
