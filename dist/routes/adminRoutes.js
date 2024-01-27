"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
// import express, { Request, Response, NextFunction } from "express";
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post('/vendors', controllers_1.createVendor);
router.get('/vendors', controllers_1.getVendor);
router.get('/vendors/:id', controllers_1.getVendorById);
router.patch('/vendors/:id', controllers_1.updateVendorById);
router.delete('/vendors/:id', controllers_1.deleteVendorById);
// router.get('/vendors/stats', vendorStats);
router.post('/riders', controllers_1.createRider);
router.get('/riders', controllers_1.getRider);
router.get('/riders/:id', controllers_1.getRiderById);
router.patch('/riders/:id', controllers_1.updateRiderById);
router.delete('/riders/:id', controllers_1.deleteRiderById);
//# sourceMappingURL=adminRoutes.js.map