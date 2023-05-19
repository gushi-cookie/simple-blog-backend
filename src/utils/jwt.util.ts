import jwt from 'jsonwebtoken';

function generateAccessToken(payload: any): string {
    return jwt.sign(payload, process.env.SECRET_TOKEN as string, { expiresIn: '1800s' });
};

export default {
    generateAccessToken,
};