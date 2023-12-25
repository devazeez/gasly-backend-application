import { Request, Response, NextFunction } from "express";
import { createVendorinput, createRiderinput } from "../dto";
import { Vendor, Rider } from "../models";
import { genSalt } from "bcrypt";
import { GeneratePassword, GenerateSalt, phoneValidaion, emailValidator } from "../utility";




export const createVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, emailAddress, phoneNumber, address, password } = <createVendorinput>req.body;


    const existingVendorEmail = await Vendor.findOne({ emailAddress: emailAddress })
    const existingVendorName = await Vendor.findOne({ name: name })
    const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber })

    if (existingVendorEmail !== null) {
        res.status(400).json({
            "message": "A vendor with email" + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingVendorName !== null) {
        res.status(400).json({
            "message": "A vendor with name" + "'" + name + "'" + " already exists"
        })
    } else if (existingVendorPhone !== null) {
        res.status(400).json({
            "message": "A vendor with phone" + "'" + phoneNumber + "'" + " already exists"
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
        address: address,
        password: hashedPassword,
        salt: salt,
        serviceAvaliable: false,
        coverImages: 'test',
        rating: 0,
    })
    return res.json(createVendor)
}


export const getVendor = async (req: Request, res: Response, next: NextFunction) => {

    const vendors = await Vendor.find()
    if (vendors !== null) {
        return res.status(200).json(vendors)
    } else {
        return res.status(404).json({
            "message": "No vendors found"
        })
    }


}


export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {

    const vendorId = req.params.id
    const vendor = await Vendor.findById(vendorId)

    if (vendor !== null) {
        return res.status(200).json(vendor)
    } else {
        return res.status(404).json({
            "message": "Vendor does not exists"
        })
    }


}


export const updateVendorById = async (req: Request, res: Response, next: NextFunction) => {

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










export const createRider = async (req: Request, res: Response, next: NextFunction) => {

    const { name, emailAddress, phoneNumber, address, password, imageUrl } = <createRiderinput>req.body;


    const existingRiderEmail = await Rider.findOne({ emailAddress: emailAddress })
    const existingRiderName = await Rider.findOne({ name: name })
    const existingRiderPhone = await Rider.findOne({ phoneNumber: phoneNumber })
    const validatedNigerianNumber = phoneValidaion(phoneNumber)
    const isValidEmail = emailValidator(emailAddress)

    if (validatedNigerianNumber !== true) {
        res.status(400).json({
            "message": "The number" + "'" + phoneNumber + "'" + "is not a valid Nigerian number"
        })
    } else if (isValidEmail !== true) {
        res.status(400).json({
            "message": "The email" + "'" + emailAddress + "'" + "is not a valid"
        })
    }

    if (existingRiderEmail !== null) {
        res.status(400).json({
            "message": "A Rider with email" + "'" + emailAddress + "'" + " already exists"
        })
    } else if (existingRiderName !== null) {
        res.status(400).json({
            "message": "A Rider with name" + "'" + name + "'" + " already exists"
        })
    } else if (existingRiderPhone !== null) {
        res.status(400).json({
            "message": "A Rider with phone" + "'" + phoneNumber + "'" + " already exists"
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
        phoneNumber: phoneNumber,
        address: address,
        password: hashedPassword,
        salt: salt,
        serviceAvaliable: false,
        imageUrl: imageUrl,
    })
    return res.json(createRider)
}

export const getRider = async (req: Request, res: Response, next: NextFunction) => {

    const riders = await Rider.find()
    if (riders !== null) {
        return res.status(200).json(riders)
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
        return res.status(200).json(rider)
    } else {
        return res.status(404).json({
            "message": "Rider does not exists"
        })
    }


}


export const updateRiderById = async (req: Request, res: Response, next: NextFunction) => {

}

export const deleteRiderById = async (req: Request, res: Response, next: NextFunction) => {

}