import express, { Request, Response, NextFunction } from "express";
import { vendorLogin, getProfile, updateProfile } from "../controllers/vendorControllers/vendor";
import { authenticate } from "../middlewares";


const router = express.Router()

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {

    res.json({ "message": "Hello from Azeez vendor" })

})



router.post('/login', vendorLogin)

router.use (authenticate)
router.get('/profile', getProfile)
router.patch('/profile',updateProfile)
router.patch('/service')


export { router as VendorRoute }