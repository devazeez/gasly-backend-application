import { Request } from 'express';
import { authPayLoad } from '../dto/auth.dto';
export declare function passwordComplexity(password: string): any;
export declare const GenerateSalt: () => Promise<string>;
export declare const GeneratePassword: (password: string, salt: string) => Promise<string>;
export declare const validatePassword: (enteredPassword: string, salt: string, savedPassword: string) => Promise<boolean>;
export declare const generateToken: (payload: authPayLoad) => string;
export declare const validateToken: (req: Request) => Promise<boolean>;
