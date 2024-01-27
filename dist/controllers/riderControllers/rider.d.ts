import { Request, Response } from "express";
export declare const riderSignUp: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const riderLogin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRiderProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateRiderProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
