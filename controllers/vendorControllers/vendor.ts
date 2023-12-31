import { Request, Response, NextFunction } from "express";
import { createVendorinput, updateVendorinput, vendorLoginInput, updateProfileInput } from "../../dto";
import { Vendor } from "../../models";
import { findVendor } from "../adminControllers/vendor";
import { generateToken, validatePassword, phoneValidaion } from '../../utility'

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { emailAddress, password } = <vendorLoginInput>req.body

    const existingVendor = await findVendor('', '', emailAddress, '')

    if (existingVendor !== null) {
        const validateVendorPassword = await validatePassword(password, existingVendor.salt, existingVendor.password)
        if (validateVendorPassword) {

            const token = generateToken({
                _id: existingVendor.id,
                emailAddress: existingVendor.emailAddress,
                password: existingVendor.password,
            })
            return res.status(200).json({
                "message": "Vendor logged in successfully",
                "token": token,
                "data": existingVendor
            })
        } else {
            res.status(401).json({
                "message": "Invalid login credentials"
            })
        }
    } else {
        res.status(401).json({
            "message": "Invalid login credentials"
        })
    }
}


export const getProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if (user) {

        const existingVendor = await findVendor('', '', user.emailAddress, '');

        if (existingVendor == null){
            return res.status(404).json({
                "message": "Vendor does not exists"
            })
        }else{
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": existingVendor
            })
        }

    } else return res.status(404).json({
        "message": 'User not found'
    })

}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if (user) {

        const existingVendor = await findVendor('', '', user.emailAddress, '');

        const { name, phoneNumber, businessName } = <updateProfileInput>req.body;
        const validatedNigerianNumber = phoneValidaion(phoneNumber)

        if (validatedNigerianNumber !== true) {
            res.status(400).json({
                "message": "The number " + "'" + phoneNumber + "'" + "is not a valid Nigerian number"
            })
        }

        const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: user._id } })
        const existingBusinessName = await Vendor.findOne({ businessName: businessName, _id: { $ne: user._id } })

        if (existingVendor == null){
            return res.status(404).json({
                "message": "Vendor does not exists"
            })
        } else if (existingVendor) {

            if (existingVendorPhone !== null) {
                res.status(400).json({
                    "message": "A vendor with phone " + "'" + phoneNumber + "'" + " already exists"
                })
            } else if (existingBusinessName !== null) {
                res.status(400).json({
                    "message": "A vendor with business name " + "'" + businessName + "'" + " already exists"
                })
            }else{

                existingVendor.name = name,
                existingVendor.phoneNumber = phoneNumber,
                existingVendor.businessName = businessName

            const updatedVendor = await existingVendor.save()

            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": updatedVendor
            })

            }

        }

    } else return res.status(404).json({
        "message": 'User not found'
    })

}