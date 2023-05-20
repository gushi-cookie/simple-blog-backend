import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { type TokenPayload } from '../utils/jwt.util';


export interface CustomRequest extends Request {
    payload: TokenPayload
};

export default function authenticateToken(req: Request, res: Response, next: Function) {
    const authHeader = req.headers['authorization']?.replace('Bearer ', '');
    const token = authHeader && authHeader.split(' ')[0];

    if(token == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.SECRET_TOKEN as string, (err: any, payload: any) => {
        if(err) {
            console.log(err);
            res.sendStatus(403);
            return;
        }
        (req as CustomRequest).payload = payload;
        next();
    });
};