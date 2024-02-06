"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
// import express, { Request, Response, NextFunction } from "express";
const vendor_1 = require("../controllers/vendorControllers/vendor");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.VendorRoute = router;
router.post('/signup', vendor_1.vendorSignUp);
router.post('/login', vendor_1.vendorLogin);
router.use(middlewares_1.authenticate);
router.get('/profile', vendor_1.getVendorProfile);
router.patch('/profile', vendor_1.updateVendorProfile);
router.patch('/service');
router.post('/products', vendor_1.createProduct);
router.get('/products');
router.patch('/products');
//# sourceMappingURL=vendorRoutes.js.map