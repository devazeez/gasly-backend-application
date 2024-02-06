import { Request, Response, NextFunction } from 'express'
import { authPayLoad } from '../dto/auth.dto'
import{validateToken} from '../utility'


declare global {
    namespace Express {
        interface Request {
            user?: authPayLoad
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await validateToken(req);

    if (validate) {
        next();
        return; // Ensure to return here
    } else {
        return res.status(401).json({
            "message": "Unauthorized"
        });
    }
};
