import { Request, Response, NextFunction } from "express";
import { riderLoginInput, updateRiderProfileInput } from "../../dto";
import { Rider } from "../../models";
import { genSalt } from "bcrypt";
import { GeneratePassword, GenerateSalt, generateToken, validatePassword, phoneValidaion } from "../../utility";



export const findRider = async (id: string | undefined, emailAddress: string | undefined, phoneNumber?: string | undefined) => {
    if (phoneNumber) {
        return await Rider.findOne({ phoneNumber: phoneNumber })

    } else if (emailAddress) {
        return await Rider.findOne({ emailAddress: emailAddress })

    } else {
        return await Rider.findOne({ _id: id })
    }
}

export const riderLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { emailAddress, password } = <riderLoginInput>req.body

    const existingRider = await findRider('', emailAddress, '')

    if (existingRider !== null) {
        const validateRiderPassword = await validatePassword(password, existingRider.salt, existingRider.password)

        if (validateRiderPassword) {
            const accessToken = generateToken({
                _id: existingRider._id,
                emailAddress: existingRider.emailAddress,
                password: existingRider.password
            })

            return res.status(200).json({
                "message": "Rider logged in successfully",
                "token": accessToken,
                "data": existingRider
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




export const getRiderProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if (user) {

        const existingRider = await findRider('', user.emailAddress, '');

        if (existingRider == null){
            return res.status(404).json({
                "message": "Rider does not exists"
            })
        }else{
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": existingRider
            })
        }

    } else return res.status(404).json({
        "message": 'User not found'
    })

}




export const updateRiderProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if (user) {

        const existingRider = await findRider('', user.emailAddress, '');

        const { name, phoneNumber, imageUrl } = <updateRiderProfileInput>req.body;
        const validatedNigerianNumber = phoneValidaion(phoneNumber)

        if (validatedNigerianNumber !== true) {
            res.status(400).json({
                "message": "The number " + "'" + phoneNumber + "'" + "is not a valid Nigerian number"
            })
        }

        const existingRiderPhone = await Rider.findOne({ phoneNumber: phoneNumber, _id: { $ne: user._id } })

        if (existingRider == null) {
            return res.status(404).json({
                "message": "Rider does not exists"
            })
        } else if (existingRider) {

            if (existingRiderPhone !== null) {
                res.status(400).json({
                    "message": "A Rider with phone " + "'" + phoneNumber + "'" + " already exists"
                })

            } else {

                existingRider.name = name,
                    existingRider.phoneNumber = phoneNumber,
                    existingRider.imageUrl = imageUrl

                const updatedRider = await existingRider.save()

                return res.status(200).json({
                    "message": "Profile fetched successfully",
                    "data": updatedRider
                })

            }

        }

    } else return res.status(404).json({
        "message": 'User not found'
    })

}




