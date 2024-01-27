"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRiderProfile = exports.getRiderProfile = exports.riderLogin = exports.riderSignUp = void 0;
const models_1 = require("../../models");
// import { genSalt } from "bcrypt";
const utility_1 = require("../../utility");
const findRider = async (id, emailAddress, phoneNumber) => {
    if (phoneNumber) {
        return await models_1.Rider.findOne({ phoneNumber: phoneNumber });
    }
    else if (emailAddress) {
        return await models_1.Rider.findOne({ emailAddress: emailAddress });
    }
    else {
        return await models_1.Rider.findOne({ _id: id });
    }
};
const riderSignUp = async (req, res) => {
    const { name, emailAddress, phoneNumber, address, password, imageUrl, state, lga } = req.body;
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
    const existingRiderEmail = await models_1.Rider.findOne({ emailAddress: emailAddress });
    const existingRiderName = await models_1.Rider.findOne({ name: name });
    const existingRiderPhone = await models_1.Rider.findOne({ phoneNumber: phoneNumber });
    if (existingRiderEmail) {
        return res.status(400).json({
            "message": `A Rider with email '${emailAddress}' already exists`
        });
    }
    else if (existingRiderName) {
        return res.status(400).json({
            "message": `A Rider with name '${name}' already exists`
        });
    }
    else if (existingRiderPhone) {
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
    if (isPasswordComplex.error) {
        return res.status(400).json({
            "message": "Invalid password complexity",
            "data": isPasswordComplex.error.details,
        });
    }
    const validatedPassword = isPasswordComplex.value;
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
    return res.status(200).json({
        "message": "Rider successfully signed up",
        "data": createdRider
    });
};
exports.riderSignUp = riderSignUp;
const riderLogin = async (req, res) => {
    const { emailAddress, password } = req.body;
    const existingRider = await findRider('', emailAddress, '');
    if (existingRider) {
        const validateRiderPassword = await (0, utility_1.validatePassword)(password, existingRider.salt, existingRider.password);
        if (validateRiderPassword) {
            const accessToken = (0, utility_1.generateToken)({
                _id: existingRider._id,
                emailAddress: existingRider.emailAddress,
                password: existingRider.password
            });
            return res.status(200).json({
                "message": "Rider logged in successfully",
                "token": accessToken,
                "data": existingRider
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
exports.riderLogin = riderLogin;
const getRiderProfile = async (req, res) => {
    const user = req.user;
    if (user) {
        const existingRider = await findRider('', user.emailAddress, '');
        if (!existingRider) {
            return res.status(404).json({
                "message": "Rider does not exist"
            });
        }
        else {
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": existingRider
            });
        }
    }
    else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};
exports.getRiderProfile = getRiderProfile;
const updateRiderProfile = async (req, res) => {
    const user = req.user;
    if (user) {
        const existingRider = await findRider('', user.emailAddress, '');
        const { name, phoneNumber, imageUrl } = req.body;
        const validatedNigerianNumber = (0, utility_1.phoneValidaion)(phoneNumber);
        if (!validatedNigerianNumber) {
            return res.status(400).json({
                "message": `The number '${phoneNumber}' is not a valid Nigerian number`
            });
        }
        const existingRiderPhone = await models_1.Rider.findOne({ phoneNumber: phoneNumber, _id: { $ne: user._id } });
        if (!existingRider) {
            return res.status(404).json({
                "message": "Rider does not exist"
            });
        }
        else if (existingRiderPhone) {
            return res.status(400).json({
                "message": `A Rider with phone '${phoneNumber}' already exists`
            });
        }
        else {
            existingRider.name = name;
            existingRider.phoneNumber = phoneNumber;
            existingRider.imageUrl = imageUrl;
            const updatedRider = await existingRider.save();
            return res.status(200).json({
                "message": "Profile fetched successfully",
                "data": updatedRider
            });
        }
    }
    else {
        return res.status(404).json({
            "message": 'User not found'
        });
    }
};
exports.updateRiderProfile = updateRiderProfile;
//# sourceMappingURL=rider.js.map