import { Request, Response, NextFunction } from "express";
import { createVendorinput, createRiderinput, updateVendorinput, updateRiderinput } from "../../dto";
import { Vendor, Rider } from "../../models";
import { genSalt } from "bcrypt";
import { GeneratePassword, GenerateSalt, phoneValidaion, emailValidator, passwordComplexity } from "../../utility";


// Admin Controller for Riders


export const createRider = async (req: Request, res: Response, next: NextFunction) => {

    const { name, emailAddress, phoneNumber, address, password, imageUrl, state, lga } = <createRiderinput>req.body;


    const validatedNigerianNumber = phoneValidaion(phoneNumber)
    const isValidEmail = emailValidator(emailAddress)
    const existingRiderEmail = await Rider.findOne({ emailAddress: emailAddress })
    const existingRiderName = await Rider.findOne({ name: name })
    const existingRiderPhone = await Rider.findOne({ phoneNumber: phoneNumber })

    if (validatedNigerianNumber !== true) {
        res.status(400).json({
            "message": "The number " + "'" + phoneNumber + "'" + "is not a valid Nigerian number"
        })
    } else if (isValidEmail !== true) {
        res.status(400).json({
            "message": "The email " + "'" + emailAddress + "'" + "is not a valid email address"
        })
    }

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
    const createRider = await Rider.create({
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
    return res.status(201).json({
        "message": "Rider created successfully",
        "data": createRider
    })
}

export const getRider = async (req: Request, res: Response, next: NextFunction) => {

    const riders = await Rider.find().sort({ createdAt: -1 })
    if (riders !== null) {
        return res.status(200).json({
            "message": "Riders returned successfully",
            "data": riders
        })
    } else {
        return res.status(404).json({
            "message": "No riders found"
        })
    }


}


export const getRiderById = async (req: Request, res: Response, next: NextFunction) => {

    const riderId = req.params.id
    const rider = await Rider.findById(riderId)

    if (rider !== null) {
        return res.status(200).json({
            "message": "Rider returned successfully",
            "data": rider
        })
    } else {
        return res.status(404).json({
            "message": "Rider does not exists"
        })
    }


}


export const updateRiderById = async (req: Request, res: Response, next: NextFunction) => {

    const riderId = req.params.id
    const existingRider = await Rider.findById(riderId)

    if (!existingRider) {
        return res.status(404).json({
            "message": "Rider not found"
        });
    }

    const { name, emailAddress, phoneNumber, address } = <updateRiderinput>req.body;

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

    // Check for existing riders with the same email or phone, excluding the current rider
    const existingRiderEmail = await Rider.findOne({ emailAddress: emailAddress, _id: { $ne: riderId } })
    const existingRiderPhone = await Rider.findOne({ phoneNumber: phoneNumber, _id: { $ne: riderId } })

    if (existingRiderEmail !== null) {
        res.status(400).json({
            "message": "A rider with email " + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingRiderPhone !== null) {
        res.status(400).json({
            "message": "A rider with phone " + "'" + phoneNumber + "'" + " already exists"
        })
    } else {
        // Update the existing rider
        existingRider.name = name
        existingRider.emailAddress = emailAddress
        existingRider.phoneNumber = phoneNumber
        existingRider.address = address

        // Save the updated rider
        const updatedRider = await existingRider.save()

        return res.status(200).json({
            "message": "Rider updated successfully",
            "data": updatedRider
        })
    }
}


export const deleteRiderById = async (req: Request, res: Response, next: NextFunction) => {

    const riderId = req.params.id
    const rider = await Rider.findByIdAndDelete(riderId)

    if (rider !== null) {
        return res.status(200).json({
            "message": "Rider deleted successfully",
            "data": rider
        })
    } else {
        return res.status(404).json({
            "message": "Rider does not exists"
        })
    }

}