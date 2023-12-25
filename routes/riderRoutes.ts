import express, { Request, Response, NextFunction } from "express";
import { createRider, getRider, getRiderById, updateRiderById, deleteRiderById} from "../controllers";

const router = express.Router();


router.post('/Riders', createRider);

router.get('/Riders', getRider);

router.get('/Riders/:id', getRiderById);

router.patch('/Riders', updateRiderById);

router.delete('/Riders/:id', deleteRiderById);




// router.get('/api/Riders/:id', (req: Request, res: Response, next: NextFunction) =>{

//     res.json({"message": "Hello from Azeez Admin"});
// })

export {router as AdminRoute};