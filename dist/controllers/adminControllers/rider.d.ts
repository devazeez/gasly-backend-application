import { Request, Response } from "express";
export declare const createRider: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRider: (res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getRiderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateRiderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteRiderById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
