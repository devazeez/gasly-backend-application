import express from "express";
// import express, { Request, Response, NextFunction } from "express";

import { getStates } from "../controllers";

const router = express.Router();

router.get("/states", getStates);

///states/lagos/surulere

export { router as StateRoute };
