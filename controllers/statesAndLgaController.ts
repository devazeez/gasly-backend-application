import { Request, Response, NextFunction } from "express";
const NaijaStates = require('naija-state-local-government');



export const getStates = async (req: Request, res: Response, next: NextFunction) => {

        const states = NaijaStates.all()

        if (states !== null) {
                return res.status(200).json({
                        "message": "Successfully returned states available",
                        "data": states
                })
        } else {
                return res.status(404).json({
                        "message": "States and LGAs are not available"
                })
        }
}