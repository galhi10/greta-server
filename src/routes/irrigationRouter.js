import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import userService from "../bl/irrigationService";

const router = express.Router();
router.get(
  "/getIrregSec",
  async (req, res) => {
    const body = {
      user_id: req.body.user_id,
    };
    try {
      const result = await userService.getIrregSec(body);
      res.json(result.schedule);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

router.post(
  "/pushIrregSec",
  async (req, res) => {
    const body = {
      date: req.body.date,
      time: req.body.time,
      status: req.body.status,
      humidity: req.body.humidity,
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
