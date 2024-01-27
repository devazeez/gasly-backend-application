"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderRoute = void 0;
const express_1 = __importDefault(require("express"));
// import express, { Request, Response, NextFunction } from "express";
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.RiderRoute = router;
router.post("/signup", controllers_1.riderSignUp);
router.post("/login", controllers_1.riderLogin);
router.use(middlewares_1.authenticate);
router.get("/profile", controllers_1.getRiderProfile);
router.patch("/profile", controllers_1.updateRiderProfile);
//# sourceMappingURL=riderRoutes.js.map