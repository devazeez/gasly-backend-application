import { Request, Response, NextFunction } from 'express';
import { authPayLoad } from '../dto/auth.dto';
declare global {
    namespace Express {
        interface Request {
            user?: authPayLoad;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
