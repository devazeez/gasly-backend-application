"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRiderById = exports.updateRiderById = exports.getRiderById = exports.getRider = exports.createRider = void 0;
const models_1 = require("../../models");
// import { genSalt } from "bcrypt";
const utility_1 = require("../../utility");
// Admin Controller for Riders
const createRider = async (req, res) => {
    const { name, emailAddress, phoneNumber, address, password, imageUrl, state, lga } = req.body;
    const validatedNigerianNumber = (0, utility_1.phoneValidaion)(phoneNumber);
    const isValidEmail = (0, utility_1.emailValidator)(emailAddress);
    const existingRiderEmail = await models_1.Rider.findOne({ emailAddress: emailAddress });
    const existingRiderName = await models_1.Rider.findOne({ name: name });
    const existingRiderPhone = await models_1.Rider.findOne({ phoneNumber: phoneNumber });
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
    if (existingRiderEmail !== null) {
        return res.status(400).json({
            "message": `A Rider with email '${emailAddress}' already exists`
        });
    }
    else if (existingRiderName !== null) {
        return res.status(400).json({
            "message": `A Rider with name '${name}' already exists`
        });
    }
    else if (existingRiderPhone !== null) {
        return res.status(400).json({
            "message": `A Rider with phone '${phoneNumber}' already exists`
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
    // Creates Rider
    const createdRider = await models_1.Rider.create({
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
    });
    return res.status(201).json({
        "message": "Rider created successfully",
        "data": createdRider
    });
};
exports.createRider = createRider;
const getRider = async (res) => {
    const riders = await models_1.Rider.find().sort({ createdAt: -1 });
    if (riders.length > 0) {
        return res.status(200).json({
            "message": "Riders returned successfully",
            "data": riders
        });
    }
    else {
        return res.status(404).json({
            "message": "No riders found"
        });
    }
};
exports.getRider = getRider;
const getRiderById = async (req, res) => {
    const riderId = req.params.id;
    const rider = await models_1.Rider.findById(riderId);
    if (rider !== null) {
        return res.status(200).json({
            "message": "Rider returned successfully",
            "data": rider
        });
    }
    else {
        return res.status(404).json({
            "message": "Rider does not exist"
        });
    }
};
exports.getRiderById = getRiderById;
const updateRiderById = async (req, res) => {
    const riderId = req.params.id;
    const existingRider = await models_1.Rider.findById(riderId);
    if (!existingRider) {
        return res.status(404).json({
            "message": "Rider not found"
        });
    }
    const { name, emailAddress, phoneNumber, address } = req.body;
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
    // Check for existing riders with the same email or phone, excluding the current rider
    const existingRiderEmail = await models_1.Rider.findOne({ emailAddress: emailAddress, _id: { $ne: riderId } });
    const existingRiderPhone = await models_1.Rider.findOne({ phoneNumber: phoneNumber, _id: { $ne: riderId } });
    if (existingRiderEmail !== null) {
        return res.status(400).json({
            "message": `A rider with email '${emailAddress}' already exists`
        });
    }
    else if (existingRiderPhone !== null) {
        return res.status(400).json({
            "message": `A rider with phone '${phoneNumber}' already exists`
        });
    }
    else {
        // Update the existing rider
        existingRider.name = name;
        existingRider.emailAddress = emailAddress;
        existingRider.phoneNumber = phoneNumber;
        existingRider.address = address;
        // Save the updated rider
        const updatedRider = await existingRider.save();
        return res.status(200).json({
            "message": "Rider updated successfully",
            "data": updatedRider
        });
    }
};
exports.updateRiderById = updateRiderById;
const deleteRiderById = async (req, res) => {
    const riderId = req.params.id;
    const rider = await models_1.Rider.findByIdAndDelete(riderId);
    if (rider !== null) {
        return res.status(200).json({
            "message": "Rider deleted successfully",
            "data": rider
        });
    }
    else {
        return res.status(404).json({
            "message": "Rider does not exist"
        });
    }
};
exports.deleteRiderById = deleteRiderById;
//# sourceMappingURL=rider.js.map