import express, { Request, Response, NextFunction } from "express";
import { getRiderProfile, updateRiderProfile, riderLogin} from "../controllers";
import { authenticate } from "../middlewares";

const router = express.Router();


router.post('/login', riderLogin);


router.use(authenticate)
router.get('/profile', getRiderProfile);
router.patch('/profile', updateRiderProfile);





// router.get('/api/Riders/:id', (req: Request, res: Response, next: NextFunction) =>{

//     res.json({"message": "Hello from Azeez Admin"});
// })

export {router as RiderRoute};