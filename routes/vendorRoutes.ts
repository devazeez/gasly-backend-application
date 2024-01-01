import express, { Request, Response, NextFunction } from "express";
import { vendorLogin, getVendorProfile, updateVendorProfile, vendorSignUp } from "../controllers/vendorControllers/vendor";
import { authenticate } from "../middlewares";


const router = express.Router()





router.post('/signup', vendorSignUp)
router.post('/login', vendorLogin)

router.use (authenticate)
router.get('/profile', getVendorProfile)
router.patch('/profile',updateVendorProfile)
router.patch('/service')


export { router as VendorRoute }