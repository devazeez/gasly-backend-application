import express, { Request, Response, NextFunction } from "express";
import {
  getRiderProfile,
  updateRiderProfile,
  riderLogin,
  riderSignUp,
} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();

router.post("/signup", riderSignUp);
router.post("/login", riderLogin);

router.use(authenticate);
router.get("/profile", getRiderProfile);
router.patch("/profile", updateRiderProfile);

export { router as RiderRoute };
