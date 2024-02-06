import { Request, Response } from "express";
export declare const vendorSignUp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const vendorLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getVendorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateVendorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
