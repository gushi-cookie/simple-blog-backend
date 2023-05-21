import { Request, Response } from 'express';
import { BlogPost } from '../models/blog-post.model';
import { File } from '../models/file.model';
import { type CustomRequest } from '../middlewares/authenticateToken';
import fileUtil, { type ValidatedFileName } from '../utils/file.util';


async function fetchBlogPost(req: Request, res: Response) {
    let id: number = Number(req.params.id);

    let post = await BlogPost.findOne({
        where: { id },
    });

    if(!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
    }

    let file = await File.findOne({ 
        where: { postId: post.id },
        attributes: ['id', 'name', 'extension'],
    });

    let fileUrl;
    if(file) fileUrl = `/cdn/files/${file.id}/${file.name}.${file.extension}`;

    res.json({
        message: 'Success.',
        post: {
            id: post.id,
            userId: post.userId,
            message: post.message,
            fileUrl,
            date: post.date,
        },
    });
};

async function createBlogPost(req: Request, res: Response) {
    // expected body params: message OR file, fileName
    if(!req.body.message && !req.body.file || req.body.file && !req.body.fileName) {
        res.status(400).json({ message: 'Post create request must have one of these parameters: message OR file, fileName' });
        return;
    }

    let fileName: ValidatedFileName | null = null;
    if(req.body.file) {
        let result = fileUtil.validateFileName(req.body.fileName);
        if(!result) return res.status(400).json({ message: 'File format is not supported.' });
        fileName = result;
    }
    

    let payload = (req as CustomRequest).payload;
    let post = await BlogPost.create({
        userId: payload.userId,
        message: req.body.message,
        date: Date.now(),
    });


    if(req.body.file && fileName) {
        await File.create({
            postId: post.id,
            name: fileName.name,
            extension: fileName.extension,
            data: req.body.file,
        });
    }


    res.json({
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
        return res.status(404).json({ message: 'Post not found.' });
    } else if(post.userId !== payload.userId) {
        return res.status(403).json({ message: 'Permission denied.' });
    }

    await BlogPost.destroy({
        where: { id: post.id },
    });

    res.json({ message: 'Post has been deleted.' });
};

async function editBlogPost(req: Request, res: Response) {
    // expected body params: message
    let postId: number = Number(req.params.id);
    let payload = (req as CustomRequest).payload;

    let message = req.body.message;
    if(!message) {
        return res.status(400).json({ message: 'Couldn\'t handle the request due to invalid or insufficient params.' });
    }

    let post = await BlogPost.findOne({
        where: { id: postId },
    });

    if(!post) {
        return res.status(404).json({ message: 'Post not found.' });
    } else if(post.userId !== payload.userId) {
        return res.status(403).json({ message: 'Permission denied.' });
    } else if(post.message === message) {
        return res.status(400).json({ message: 'Nothing to update.' });
    }

    post.set({
        message,
        date: Date.now(),
    });
    await post.save();

    res.json({
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