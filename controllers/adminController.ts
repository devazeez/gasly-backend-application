import { Request, Response, NextFunction } from "express";
import { createVendorinput, createRiderinput, updateVendorinput, updateRiderinput } from "../dto";
import { Vendor, Rider } from "../models";
import { genSalt } from "bcrypt";
import { GeneratePassword, GenerateSalt, phoneValidaion, emailValidator } from "../utility";



export const createVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, emailAddress, phoneNumber, state, lga, address, businessName, password } = <createVendorinput>req.body;


    const existingVendorEmail = await Vendor.findOne({ emailAddress: emailAddress })
    const existingVendorName = await Vendor.findOne({ name: name })
    const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber })
    const existingVendorBusinessName = await Vendor.findOne({ businessName: businessName })


    if (existingVendorEmail !== null) {
        res.status(400).json({
            "message": "A vendor with email " + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingVendorName !== null) {
        res.status(400).json({
            "message": "A vendor with name " + "'" + name + "'" + " already exists"
        })
    } else if (existingVendorPhone !== null) {
        res.status(400).json({
            "message": "A vendor with phone " + "'" + phoneNumber + "'" + " already exists"
        })
    } else if (existingVendorBusinessName !== null) {
        res.status(400).json({
            "message": "A vendor with business name " + "'" + existingVendorBusinessName + "'" + " already exists"
        })
    }

    if (state !== "Lagos" && lga !== "Surulere") {
        res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        })
    }

    // Generates salt
    const salt = await GenerateSalt()
    // Hashes password
    const hashedPassword = await GeneratePassword(password, salt)


    // Creates Vendor
    const createVendor = await Vendor.create({
        name: name,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        status: "pending",
        state: state,
        lga: lga,
        address: address,
        businessName: businessName,
        password: hashedPassword,
        salt: salt,
        serviceAvaliable: false,
        coverImages: 'test',
        rating: 0,
    })
    return res.status(201).json({
        "message": "Vendor created successfully",
        "data": createVendor
    })
}


export const getVendor = async (req: Request, res: Response, next: NextFunction) => {

    const vendors = await Vendor.find().sort({ createdAt: -1 })
    if (vendors !== null) {
        return res.status(200).json({
            "message": "vendors returned successfully",
            "data": vendors
        });
    } else {
        return res.status(200).json({
            "message": "No vendors found",
            "data": vendors
        })
    }
}


export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {

    const vendorId = req.params.id
    const vendor = await Vendor.findById(vendorId)

    if (vendor !== null) {
        return res.status(200).json({
            "message": "vendors returned successfully",
            "data": vendor
        });
    } else {
        return res.status(404).json({
            "message": "Vendor does not exists"
        })
    }


}


export const updateVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id
    const existingVendor = await Vendor.findById(vendorId)

    if (!existingVendor) {
        return res.status(404).json({
            "message": "Vendor not found"
        });
    }

    const { name, emailAddress, phoneNumber, address, businessName } = <updateVendorinput>req.body;

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

    // Check for existing vendors with the same email or phone, excluding the current vendor
    const existingVendorEmail = await Vendor.findOne({ emailAddress: emailAddress, _id: { $ne: vendorId } })
    const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: vendorId } })
    const existingBusinessName = await Vendor.findOne({ businessName: businessName, _id: { $ne: vendorId } })

    if (existingVendorEmail !== null) {
        res.status(400).json({
            "message": "A vendor with email " + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingVendorPhone !== null) {
        res.status(400).json({
            "message": "A vendor with phone " + "'" + phoneNumber + "'" + " already exists"
        })
    } else if (existingBusinessName !== null) {
        res.status(400).json({
            "message": "A vendor with " + "'" + businessName + "'" + " already exists"
        })
    }
    else {
        // Update the existing vendor
        existingVendor.name = name
        existingVendor.emailAddress = emailAddress
        existingVendor.phoneNumber = phoneNumber
        existingVendor.address = address
        existingVendor.businessName = businessName

        // Save the updated vendor
        const updatedVendor = await existingVendor.save()

        return res.status(200).json({
            "message": "Vendor updated successfully",
            "data": updatedVendor
        })
    }
}




export const deleteVendorById = async (req: Request, res: Response, next: NextFunction) => {

    const vendorId = req.params.id
    const vendor = await Vendor.findByIdAndDelete(vendorId)

    if (vendor !== null) {
        return res.status(200).json({
            "message": "Vendor deleted successfully",
            vendor
        })
    } else {
        return res.status(404).json({
            "message": "Vendor does not exists"
        })
    }
}




































































































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

    if (state !== "Lagos" && lga !== "Surulere") {
        res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        })
    }


    // Generates salt
    const salt = await GenerateSalt()
    // Hashes password
    const hashedPassword = await GeneratePassword(password, salt)


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
        serviceAvaliable: false,
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