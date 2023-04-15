import express, { Request, Response, NextFunction, Router } from "express";
import { check, validationResult } from "express-validator";
import configService from "../bl/configService";

const router = express.Router();
router.get(
  "/getConfig",
  async (req, res) => {
    const body = {
      user_id: req.body.user_id,
    };
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
      const result = await configService.setConfig(body);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(err.status).json({ ok: false, message: err.message });
    }
  }
);

module.exports = router;
