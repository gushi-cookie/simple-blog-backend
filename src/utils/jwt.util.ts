import jwt from 'jsonwebtoken';

function generateAccessToken(payload: any, expiresIn: string): string {
    return jwt.sign(payload, process.env.SECRET_TOKEN as string, { expiresIn });
};

export default {
    generateAccessToken,
};