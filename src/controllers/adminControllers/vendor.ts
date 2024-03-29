import { Request, Response, } from "express";
import { createVendorinput, updateVendorinput } from "../../dto";
import { Vendor } from "../../models";
import { GeneratePassword, GenerateSalt, phoneValidaion, emailValidator, passwordComplexity } from "../../utility";

const findVendor = async (id: string | undefined, businessName: string | undefined, emailAddress: string | undefined, phoneNumber?: string | undefined) => {
    if (phoneNumber) {
        return await Vendor.findOne({ phoneNumber: phoneNumber });
    } else if (emailAddress) {
        return await Vendor.findOne({ emailAddress: emailAddress });
    } else if (businessName) {
        return await Vendor.findOne({ businessName: businessName });
    } else {
        return await Vendor.findOne({ _id: id });
    }
};

export const createVendor = async (req: Request, res: Response) => {
    const { name, emailAddress, phoneNumber, state, lga, address, businessName, password } = <createVendorinput>req.body;

    const existingVendorEmail = await findVendor('', '', emailAddress, '');
    const existingVendorPhone = await findVendor('', '', '', phoneNumber);
    const existingVendorBusinessName = await findVendor('', businessName, '', '');

    if (existingVendorEmail !== null) {
        return res.status(400).json({
            "message": `A vendor with email '${emailAddress}' already exists`
        });
    } else if (existingVendorPhone !== null) {
        return res.status(400).json({
            "message": `A vendor with phone '${phoneNumber}' already exists`
        });
    } else if (existingVendorBusinessName !== null) {
        return res.status(400).json({
            "message": `A vendor with business name '${businessName}' already exists`
        });
    }

    if (state !== "Lagos" || lga !== "Surulere") {
        return res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        });
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
    const salt = await GenerateSalt();
    // Hashes password
    const hashedPassword = await GeneratePassword(validatedPassword, salt);

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
    });

    return res.status(201).json({
        "message": "Vendor created successfully",
        "data": createVendor
    });
};

export const getVendor = async ( res: Response) => {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    if (vendors.length > 0) {
        return res.status(200).json({
            "message": "Vendors returned successfully",
            "data": vendors
        });
    } else {
        return res.status(404).json({
            "message": "No vendors found"
        });
    }
};

export const getVendorById = async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId);

    if (vendor !== null) {
        return res.status(200).json({
            "message": "Vendor returned successfully",
            "data": vendor
        });
    } else {
        return res.status(404).json({
            "message": "Vendor does not exist"
        });
    }
};

export const updateVendorById = async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const existingVendor = await Vendor.findById(vendorId);

    if (!existingVendor) {
        return res.status(404).json({
            "message": "Vendor not found"
        });
    }

    const { name, emailAddress, phoneNumber, address, businessName } = <updateVendorinput>req.body;
    const validatedNigerianNumber = phoneValidaion(phoneNumber);
    const isValidEmail = emailValidator(emailAddress);

    if (!validatedNigerianNumber) {
        return res.status(400).json({
            "message": `The number '${phoneNumber}' is not a valid Nigerian number`
        });
    } else if (!isValidEmail) {
        return res.status(400).json({
            "message": `The email '${emailAddress}' is not a valid email address`
        });
    }

    // Check for existing vendors with the same email or phone, excluding the current vendor
    const existingVendorEmail = await Vendor.findOne({ emailAddress: emailAddress, _id: { $ne: vendorId } });
    const existingVendorPhone = await Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: vendorId } });
    const existingBusinessName = await Vendor.findOne({ businessName: businessName, _id: { $ne: vendorId } });

    if (existingVendorEmail !== null) {
        return res.status(400).json({
            "message": `A vendor with email '${emailAddress}' already exists`
        });
    } else if (existingVendorPhone !== null) {
        return res.status(400).json({
            "message": `A vendor with phone '${phoneNumber}' already exists`
        });
    } else if (existingBusinessName !== null) {
        return res.status(400).json({
            "message": `A vendor with business name '${businessName}' already exists`
        });
    } else {
        // Update the existing vendor
        existingVendor.name = name;
        existingVendor.emailAddress = emailAddress;
        existingVendor.phoneNumber = phoneNumber;
        existingVendor.address = address;
        existingVendor.businessName = businessName;

        // Save the updated vendor
        const updatedVendor = await existingVendor.save();

        return res.status(200).json({
            "message": "Vendor updated successfully",
            "data": updatedVendor
        });
    }
};

export const deleteVendorById = async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const vendor = await Vendor.findByIdAndDelete(vendorId);

    if (vendor !== null) {
        return res.status(200).json({
            "message": "Vendor deleted successfully",
            vendor
        });
    } else {
        return res.status(404).json({
            "message": "Vendor does not exist"
        });
    }
};
