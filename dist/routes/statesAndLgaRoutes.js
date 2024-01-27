"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRoute = void 0;
const express_1 = __importDefault(require("express"));
// import express, { Request, Response, NextFunction } from "express";
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.StateRoute = router;
router.get("/states", controllers_1.getStates);
//# sourceMappingURL=statesAndLgaRoutes.js.map