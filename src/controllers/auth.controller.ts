import jwtUtil from '../utils/jwt.util';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/user.model';


const SALT_ROUNDS = 10;
const TOKEN_DURATION_SECONDS = 43200;

async function signIn(req: Request, res: Response) {
    // expected body params: nickname, password
    if(!req.body.nickname || !req.body.password) {
        res.status(400).json({ message: 'Couldn\'t handle the request due to invalid or insufficient params.' });
        return;
    }

    let nickname: string = req.body.nickname;
    let password: string = req.body.password;

    let user = await User.findOne({
        where: { nickname },
    });

    if(!user || !bcrypt.compareSync(password, user.passHash)) {
        res.status(401).json({ message: 'User not found or passed password is wrong.' });
        return;
    }

    let token = jwtUtil.generateAccessToken({
        id: user.id,
        nickname: user.nickname,
    }, `${TOKEN_DURATION_SECONDS}s`);

    res.json({
        token,
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
        res.status(400).json({ message: 'Couldn\'t handle the request due to invalid or insufficient params.' });
        return;
    }

    let nickname: string = req.body.nickname;
    let user = await User.findOne({
        where: { nickname },
    });
    if(user) {
        res.status(409).json({ message: 'User with this nickname already exists.' });
        return;
    }

    let passHash: string = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    user = await User.create({
        nickname,
        passHash,
    });

    let token = jwtUtil.generateAccessToken({
        id: user.id,
        nickname: user.nickname,
    }, `${TOKEN_DURATION_SECONDS}s`);

    res.json({
        token,
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