import weatherApi from "../services/weatherApi";
import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult, header } from "express-validator";

const router = express.Router();
router.get(
  "/getTemp",
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 400, ...errors });
    }
    try {
      const result = await weatherApi.GetCurrentTemperature(req.city);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
