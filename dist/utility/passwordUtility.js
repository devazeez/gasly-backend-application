"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.generateToken = exports.validatePassword = exports.GeneratePassword = exports.GenerateSalt = exports.passwordComplexity = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
let joiPasswordComplexity = require("joi-password-complexity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function passwordComplexity(password) {
    let complexPassword = joiPasswordComplexity().validate(password);
    return complexPassword;
}
exports.passwordComplexity = passwordComplexity;
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const validatePassword = async (enteredPassword, salt, savedPassword) => {
    return await (0, exports.GeneratePassword)(enteredPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const validateToken = async (req) => {
    const signature = req.get('Authorization');
    if (signature) {
        const payload = await jsonwebtoken_1.default.verify(signature.split(' ')[1], config_1.APP_SECRET);
        // payload.
        req.user = payload;
        return true;
    }
    return false;
};
exports.validateToken = validateToken;
//# sourceMappingURL=passwordUtility.js.map