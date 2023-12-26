import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendor, getVendorById, updateVendorById, deleteVendorById, createRider, getRider, getRiderById, updateRiderById, deleteRiderById } from "../controllers";

const router = express.Router();


router.post('/vendors', createVendor);

router.get('/vendors', getVendor);

router.get('/vendors/:id', getVendorById);

router.patch('/vendors/:id', updateVendorById);

router.delete('/vendors/:id', deleteVendorById);


router.post('/riders', createRider);

router.get('/riders', getRider);

router.get('/riders/:id', getRiderById);

router.patch('/riders/:id', updateRiderById);

router.delete('/riders/:id', deleteRiderById);


// router.get('/api/vendors/:id', (req: Request, res: Response, next: NextFunction) =>{

//     res.json({"message": "Hello from Azeez Admin"});
// })

export { router as AdminRoute };