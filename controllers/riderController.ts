import { Request, Response, NextFunction } from "express";
import { createVendorinput, createRiderinput } from "../dto";
import { Vendor, Rider } from "../models";
import { genSalt } from "bcrypt";
import { GeneratePassword, GenerateSalt } from "../utility";


export const getVendors = async (req: Request, res: Response, next: NextFunction) => {

    const vendors = await Vendor.find()
    if (vendors !== null) {
        return res.status(200).json(vendors)
    } else {
        return res.status(404).json({
            "message": "No vendors found"
        })
    }


}