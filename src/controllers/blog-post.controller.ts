import { Request, Response } from 'express';
import { BlogPost } from '../models/blog-post.model';
import { File } from '../models/file.model';
import { type CustomRequest } from '../middlewares/authenticateToken';
import fileUtil, { type ValidatedFileName } from '../utils/file.util';
import exitCodes from '../utils/exit-codes.util';
import { User } from '../models/user.model';
import { type AssocBlogPost } from './posts-list.controller';
import mime from 'mime-types';


async function fetchBlogPost(req: Request, res: Response) {
    let id: number = Number(req.params.id);

    let post = await BlogPost.findOne({
        where: { id },
        include: User,
    }) as AssocBlogPost;

    if(!post) return res.status(404).json({ message: 'Post not found', code: exitCodes.NOT_FOUND });

    let postFile = await File.findOne({ 
        where: { postId: post.id },
        attributes: ['id', 'postId', 'name', 'extension'],
    });


    let file;
    if(postFile) {
        file = {
            url: `/cdn/files/${postFile.id}/${postFile.name}.${postFile.extension}`,
            name: `${postFile.name}.${postFile.extension}`,
            mediaType: (mime.lookup(postFile.extension) as string).split('/')[0],
        };
    }

    res.json({
        code: exitCodes.OK,
        message: 'Success.',
        post: {
            id: post.id,
            userId: post.userId,
            nickname: post.User.nickname,
            message: post.message,
            date: post.date,
            file,
        },
    });
};

async function createBlogPost(req: Request, res: Response) {
    // expected body params: message OR file in (multipart/form-data)
    if(!req.body.message && !req.file) {
        return res.status(400).json({
            code: exitCodes.INVALID_PARAMS,
            message: 'Post create request must have one of these parameters: message OR file, fileName',
        });
    }

    
    let fileName: ValidatedFileName | null = null;
    if(req.file) {
        fileName = fileUtil.validateFileName(req.file.originalname);
        if(!fileName) return res.status(400).json({ message: 'File format is not supported.', code: exitCodes.INVALID_PARAMS });
    }
    

    let payload = (req as CustomRequest).payload;
    let post = await BlogPost.create({
        userId: payload.userId,
        message: req.body.message,
        date: Date.now(),
    });


    if(req.file && fileName) {
        await File.create({
            postId: post.id,
            name: fileName.name,
            extension: fileName.extension,
            data: req.file.buffer,
        });
    }


    res.json({
        code: exitCodes.OK,
        message: 'Post created.',
        postId: post.id,
    });
};

async function deleteBlogPost(req: Request, res: Response) {
    let id: number = Number(req.params.id);
    let payload = (req as CustomRequest).payload;

    let post = await BlogPost.findOne({
        where: { id },
    });

    if(!post) {
        return res.status(404).json({ message: 'Post not found.', code: exitCodes.NOT_FOUND });
    } else if(post.userId !== payload.userId) {
        return res.status(403).json({ message: 'Permission denied.', code: exitCodes.PERMISSION_DENY });
    }

    await BlogPost.destroy({
        where: { id: post.id },
    });

    res.json({ message: 'Post has been deleted.', code: exitCodes.OK });
};

async function editBlogPost(req: Request, res: Response) {
    // expected body params: message
    let postId: number = Number(req.params.id);
    let payload = (req as CustomRequest).payload;

    let message = req.body.message;
    if(!message) {
        return res.status(400).json({ message: 'Couldn\'t handle the request due to invalid or insufficient params.', code: exitCodes.INVALID_PARAMS });
    }

    let post = await BlogPost.findOne({
        where: { id: postId },
    });

    if(!post) {
        return res.status(404).json({ message: 'Post not found.', code: exitCodes.NOT_FOUND });
    } else if(post.userId !== payload.userId) {
        return res.status(403).json({ message: 'Permission denied.', code: exitCodes.PERMISSION_DENY });
    } else if(post.message === message) {
        return res.status(400).json({ message: 'Nothing to update.', code: exitCodes.INVALID_PARAMS });
    }

    post.set({
        message,
        date: Date.now(),
    });
    await post.save();

    res.json({
        code: exitCodes.OK,
        message: 'Post modified.',
        post: {
            id: post.id,
            userId: post.userId,
            message: post.message,
            date: post.date,
        }
    });
};


export default {
    fetchBlogPost,
    createBlogPost,
    deleteBlogPost,
    editBlogPost,
};