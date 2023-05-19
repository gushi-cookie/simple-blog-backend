import jwt from 'jsonwebtoken';

export interface TokenPayload {
    userId: number,
    nickname: string,
};

function generateAccessToken(payload: TokenPayload, expiresIn: string): string {
    return jwt.sign(payload, process.env.SECRET_TOKEN as string, { expiresIn });
};

export default {
    generateAccessToken,
};