import jwt from 'jsonwebtoken';
import { Response } from 'express';


export default function authenticateToken(req: any, res: Response, next: Function) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[0];

    if(token == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.SECRET_TOKEN as string, (err: any, decoded: any) => {
        if(err) {
            console.log(err);
            res.sendStatus(403);
            return;
        }
        req.decoded = decoded;
        next();
    });
};