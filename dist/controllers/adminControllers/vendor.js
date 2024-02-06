"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVendorById = exports.updateVendorById = exports.getVendorById = exports.getVendor = exports.createVendor = void 0;
const models_1 = require("../../models");
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
const createVendor = async (req, res) => {
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
    return res.status(201).json({
        "message": "Vendor created successfully",
        "data": createVendor
    });
};
exports.createVendor = createVendor;
const getVendor = async (res) => {
    const vendors = await models_1.Vendor.find().sort({ createdAt: -1 });
    if (vendors.length > 0) {
        return res.status(200).json({
            "message": "Vendors returned successfully",
            "data": vendors
        });
    }
    else {
        return res.status(404).json({
            "message": "No vendors found"
        });
    }
};
exports.getVendor = getVendor;
const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    const vendor = await models_1.Vendor.findById(vendorId);
    if (vendor !== null) {
        return res.status(200).json({
            "message": "Vendor returned successfully",
            "data": vendor
        });
    }
    else {
        return res.status(404).json({
            "message": "Vendor does not exist"
        });
    }
};
exports.getVendorById = getVendorById;
const updateVendorById = async (req, res) => {
    const vendorId = req.params.id;
    const existingVendor = await models_1.Vendor.findById(vendorId);
    if (!existingVendor) {
        return res.status(404).json({
            "message": "Vendor not found"
        });
    }
    const { name, emailAddress, phoneNumber, address, businessName } = req.body;
    const validatedNigerianNumber = (0, utility_1.phoneValidaion)(phoneNumber);
    const isValidEmail = (0, utility_1.emailValidator)(emailAddress);
    if (!validatedNigerianNumber) {
        return res.status(400).json({
            "message": `The number '${phoneNumber}' is not a valid Nigerian number`
        });
    }
    else if (!isValidEmail) {
        return res.status(400).json({
            "message": `The email '${emailAddress}' is not a valid email address`
        });
    }
    // Check for existing vendors with the same email or phone, excluding the current vendor
    const existingVendorEmail = await models_1.Vendor.findOne({ emailAddress: emailAddress, _id: { $ne: vendorId } });
    const existingVendorPhone = await models_1.Vendor.findOne({ phoneNumber: phoneNumber, _id: { $ne: vendorId } });
    const existingBusinessName = await models_1.Vendor.findOne({ businessName: businessName, _id: { $ne: vendorId } });
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
    else if (existingBusinessName !== null) {
        return res.status(400).json({
            "message": `A vendor with business name '${businessName}' already exists`
        });
    }
    else {
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
exports.updateVendorById = updateVendorById;
const deleteVendorById = async (req, res) => {
    const vendorId = req.params.id;
    const vendor = await models_1.Vendor.findByIdAndDelete(vendorId);
    if (vendor !== null) {
        return res.status(200).json({
            "message": "Vendor deleted successfully",
            vendor
        });
    }
    else {
        return res.status(404).json({
            "message": "Vendor does not exist"
        });
    }
};
exports.deleteVendorById = deleteVendorById;
//# sourceMappingURL=vendor.js.map