import bcrypt from 'bcrypt';
import { Request } from 'express';
let joiPasswordComplexity = require("joi-password-complexity")
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config'
import { vendorPayload } from '../dto';
import { authPayLoad } from '../dto/auth.dto';


export function passwordComplexity(password: string) {

    let complexPassword = joiPasswordComplexity().validate(password);

    return complexPassword
}







export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const validatePassword = async (enteredPassword: string, salt: string, savedPassword: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword
}







export const generateToken = (payload: authPayLoad) => {

    return jwt.sign(payload, APP_SECRET, { expiresIn: '1h' })

}

export const validateToken = async (req: Request) => {
    const signature = req.get('Authorization');

    if (signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as authPayLoad;
        // payload.
        req.user = payload;

        return true;
    }
    return false;
}

