import { Request, Response, NextFunction } from "express";
import { riderLoginInput, updateRiderProfileInput, createRiderinput } from "../../dto";
import { Rider } from "../../models";
import { genSalt } from "bcrypt";
import { generateToken, validatePassword, phoneValidaion, passwordComplexity, GenerateSalt, GeneratePassword, emailValidator } from '../../utility'



export const findRider = async (id: string | undefined, emailAddress: string | undefined, phoneNumber?: string | undefined) => {
    if (phoneNumber) {
        return await Rider.findOne({ phoneNumber: phoneNumber })

    } else if (emailAddress) {
        return await Rider.findOne({ emailAddress: emailAddress })

    } else {
        return await Rider.findOne({ _id: id })
    }
}



export const riderSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const { name, emailAddress, phoneNumber, address, password, imageUrl, state, lga } = <createRiderinput>req.body;


    const validatedNigerianNumber = phoneValidaion(phoneNumber)
    const isValidEmail = emailValidator(emailAddress)

    if (validatedNigerianNumber !== true) {
        res.status(400).json({
            "message": "The number " + "'" + phoneNumber + "'" + "is not a valid Nigerian number"
        })
    } else if (isValidEmail !== true) {
        res.status(400).json({
            "message": "The email " + "'" + emailAddress + "'" + "is not a valid email address"
        })
    }

    const existingRiderEmail = await Rider.findOne({ emailAddress: emailAddress })
    const existingRiderName = await Rider.findOne({ name: name })
    const existingRiderPhone = await Rider.findOne({ phoneNumber: phoneNumber })

    if (existingRiderEmail !== null) {
        res.status(400).json({
            "message": "A Rider with email " + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingRiderName !== null) {
        res.status(400).json({
            "message": "A Rider with name " + "'" + name + "'" + " already exists"
        })
    } else if (existingRiderPhone !== null) {
        res.status(400).json({
            "message": "A Rider with phone " + "'" + phoneNumber + "'" + " already exists"
        })
    }

    if (state !== "Lagos" || lga !== "Surulere") {
        res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        })
    }

    const isPasswordComplex = passwordComplexity(password);
    let validatedPassword = '';

    if (isPasswordComplex.error) {
        return res.status(400).json({
            message: "Invalid password complexity",
            data: isPasswordComplex.error.details,
        });
    } else {
        validatedPassword = isPasswordComplex.value;
    }


    // Generates salt
    const salt = await GenerateSalt()
    // Hashes password
    const hashedPassword = await GeneratePassword(validatedPassword, salt)


    // Creates Rider
    const createdRider = await Rider.create({
        name: name,
        emailAddress: emailAddress,
        status: "pending",
        phoneNumber: phoneNumber,
        lga: lga,
        state: state,
        address: address,
        password: hashedPassword,
        salt: salt,
        imageUrl: imageUrl,
    })
    return res.status(200).json({
        "message": "Rider successfully signed up",
        "data": createdRider
    })
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

        if (existingRider == null) {
            return res.status(404).json({
                "message": "Rider does not exists"
            })
        } else {
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




