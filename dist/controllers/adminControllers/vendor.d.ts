import { Request, Response } from "express";
export declare const createVendor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getVendor: (res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getVendorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateVendorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteVendorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
