"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = exports.vendorSignUp = void 0;
const models_1 = require("../../models");
// import { findVendor } from "../adminControllers/vendor";
const utility_1 = require("../../utility");
const findVendor = async (id, businessName, emailAddress, phoneNumber) => {
    if (phoneNumber) {
        return await models_1.Vendor.findOne({ phoneNumber: phoneNumber });
    }
    else if (emailAddress) {
        return await models_1.Vendor.findOne({ emailAddress: emailAddress });
    }
    else if (businessName) {
        return await models_1.Vendor.findOne({ businessName: businessName });
    }
    else {
        return await models_1.Vendor.findOne({ _id: id });
    }
};
const vendorSignUp = async (req, res) => {
    const { name, emailAddress, phoneNumber, state, lga, address, businessName, password } = req.body;
    const existingVendorEmail = await findVendor('', '', emailAddress, '');
    const existingVendorPhone = await findVendor('', '', '', phoneNumber);
    const existingVendorBusinessName = await findVendor('', businessName, '', '');
    if (existingVendorEmail !== null) {
        return res.status(400).json({
            "message": `A vendor with email '${emailAddress}' already exists`
        });
    }
    else if (existingVendorPhone !== null) {
        return res.status(400).json({
            "message": `A vendor with phone '${phoneNumber}' already exists`
        });
    }
    else if (existingVendorBusinessName !== null) {
        return res.status(400).json({
            "message": `A vendor with business name '${businessName}' already exists`
        });
    }
    if (state !== "Lagos" || lga !== "Surulere") {
        return res.status(400).json({
            "message": "Our services aren't available at your location just yet"
        });
    }
    if (name === null) {
        return res.status(400).json({
            message: "Input values"
        });
    }
    const isPasswordComplex = (0, utility_1.passwordComplexity)(password);
    let validatedPassword = '';
    if (isPasswordComplex.error) {
        return res.status(400).json({
            message: "Invalid password complexity",
            data: isPasswordComplex.error.details,
        });
    }
    else {
        validatedPassword = isPasswordComplex.value;
    }
    // Generates salt
    const salt = await (0, utility_1.GenerateSalt)();
    // Hashes password
    const hashedPassword = await (0, utility_1.GeneratePassword)(validatedPassword, salt);
    // Creates Vendor
    const createVendor = await models_1.Vendor.create({
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
    return res.status(200).json({
        "message": "Vendor successfully signed up",
        "data": createVendor
    });
};
exports.vendorSignUp = vendorSignUp;
const vendorLogin = async (req, res) => {
    const { emailAddress, password } = req.body;
    const existingVendor = await findVendor('', '', emailAddress, '');
    if (existingVendor !== null) {
        const validateVendorPassword = await (0, utility_1.validatePassword)(password, existingVendor.salt, existingVendor.password);
        if (validateVendorPassword) {
            const accessToken = (0, utility_1.generateToken)({
                _id: existingVendor.id,
                emailAddress: existingVendor.emailAddress,
                password: existingVendor.password,
            });
            return res.status(200).json({
                "message": "Vendor logged in successfully",
                "token": accessToken,
                "data": existingVendor
            });
        }
        else {
            return res.status(401).json({
                "message": "Invalid login credentials"
            });
        }
    }
    else {
        return res.status(401).json({
            "message": "Invalid login credentials"
        });
    }
};
exports.vendorLogin = vendorLogin;
const getVendorProfile = async (req, res) => {
    const user = req.user;
    if (user) {
        const existingVendor = await findVendor('', '', user.emailAddress, '');
        if (existingVendor == null) {
            return res.status(404).json({
                "message": "Vendor does not exist"
            });
        }
        else {
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": existingVendor
            });
        }
    }
    else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = async (req, res) => {
    const user = req.user;
    if (user) {
        const existingVendor = await findVendor('', '', user.emailAddress, '');
        const { name, phoneNumber, businessName } = req.body;
        const validatedNigerianNumber = (0, utility_1.phoneValidaion)(phoneNumber);
        if (validatedNigerianNumber !== true) {
            return res.status(400).json({
                "message": "The number " + "'" + phoneNumber + "'" + " is not a valid Nigerian number"
            });
        }
        const existingVendorPhone = await models_1.Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: user._id } });
        const existingBusinessName = await models_1.Vendor.findOne({ businessName: businessName, _id: { $ne: user._id } });
        if (existingVendor == null) {
            return res.status(404).json({
                "message": "Vendor does not exist"
            });
        }
        else if (existingVendorPhone !== null) {
            return res.status(400).json({
                "message": "A vendor with phone " + "'" + phoneNumber + "'" + " already exists"
            });
        }
        else if (existingBusinessName !== null) {
            return res.status(400).json({
                "message": "A vendor with business name " + "'" + businessName + "'" + " already exists"
            });
        }
        else {
            existingVendor.name = name;
            existingVendor.phoneNumber = phoneNumber;
            existingVendor.businessName = businessName;
            const updatedVendor = await existingVendor.save();
            return res.status(200).json({
                "message": "Profile updated successfully",
                "data": updatedVendor
            });
        }
    }
    else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};
exports.updateVendorProfile = updateVendorProfile;
const createProduct = async (req, res) => {
    const user = req.user;
    if (user) {
        const { name, cylinderSize, refilPrice, purchasePrice, imageUrl, IsEmptyCylinderAvailable } = req.body;
        const existingVendor = await findVendor(user._id, '', '', '');
        if (existingVendor != null) {
            const createProduct = await models_1.Product.create({
                vendorId: existingVendor._id,
                name,
                status: "unavailable",
                imageUrl,
                cylinderSize,
                refilPrice,
                purchasePrice,
                currency: "NGN",
                IsEmptyCylinderAvailable,
            });
            return res.status(200).json({
                "message": "Product created successfully",
                "data": createProduct,
            });
        }
        else {
            return res.status(404).json({
                "message": "Vendor does not exist",
            });
        }
    }
    else {
        return res.status(404).json({
            "message": 'User not found',
        });
    }
};
exports.createProduct = createProduct;
//# sourceMappingURL=vendor.js.map