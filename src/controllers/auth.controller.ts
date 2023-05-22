import jwtUtil from '../utils/jwt.util';
import exitCodes from '../utils/exit-codes.util';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/user.model';


const SALT_ROUNDS = 10;
const TOKEN_DURATION_SECONDS = 43200;

async function signIn(req: Request, res: Response) {
    // expected body params: nickname, password
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).json({
            code: exitCodes.INVALID_PARAMS,
            message: 'Couldn\'t handle the request due to invalid or insufficient params.',
        });
    }

    let nickname: string = req.body.nickname;
    let password: string = req.body.password;

    let user = await User.findOne({
        where: { nickname },
    });

    if(!user || !bcrypt.compareSync(password, user.passHash)) {
        return res.status(401).json({
            code: exitCodes.INVALID_AUTH,
            message: 'User not found or passed password is wrong.',
        });
    }

    let token = jwtUtil.generateAccessToken({
        userId: user.id,
        nickname: user.nickname,
    }, `${TOKEN_DURATION_SECONDS}s`);

    res.json({
        token,
        code: exitCodes.OK,
        message: 'Login successful.',
        user: {
            id: user.id,
            nickname: user.nickname,
        },
    });
};


async function signUp(req: Request, res: Response) {
    // expected body params: nickname, password
    if(!req.body.nickname || !req.body.password) {
        return res.status(400).json({
            code: exitCodes.INVALID_PARAMS,
            message: 'Couldn\'t handle the request due to invalid or insufficient params.',
        });
    }

    let nickname: string = req.body.nickname;
    let user = await User.findOne({
        where: { nickname },
    });
    if(user) {
        return res.status(409).json({
            code: exitCodes.USER_ALREADY_EXISTS,
            message: 'User with this nickname already exists.',
        });
    }

    let passHash: string = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    user = await User.create({
        nickname,
        passHash,
    });

    let token = jwtUtil.generateAccessToken({
        userId: user.id,
        nickname: user.nickname,
    }, `${TOKEN_DURATION_SECONDS}s`);

    res.json({
        token,
        code: exitCodes.OK,
        message: 'User registered successfully.',
        user: {
            id: user.id,
            nickname: user.nickname,
        },
    });
};


export default {
    signIn,
    signUp,
};