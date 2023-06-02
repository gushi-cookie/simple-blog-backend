import { Request, Response } from 'express';
import { BlogPost } from '../models/blog-post.model';
import { User } from '../models/user.model';
import exitCodes from '../utils/exit-codes.util';
import { File } from '../models/file.model';
import mime from 'mime-types';


const PAGINATION = 20;

export interface AssocBlogPost extends BlogPost {
    User: User;
    File?: File;
}

async function queryFilesOfPosts(postIds: number[]) {
    return await File.findAll({
        where: { postId: postIds },
        attributes: ['id', 'postId', 'name', 'extension'],
    });
};

async function fetchList(req: Request, res: Response) {
    // available query params: page
    let pageNumber = Number(req.query.page);
    if(!pageNumber || pageNumber <= 0) pageNumber = 1;


    let result = await BlogPost.findAndCountAll({
        order: [['date', 'DESC']],
        limit: PAGINATION,
        offset: PAGINATION * (pageNumber - 1),
        include: User,
    });
    if(result.rows.length === 0) {
        return res.status(404).json({ message: 'List not found.', code: exitCodes.NOT_FOUND });
    }


    let posts = new Array<AssocBlogPost>();
    result.rows.forEach(row => {
        posts.push((row as any));
    });

    let files = await queryFilesOfPosts(posts.map((post) => post.id));
    posts.forEach((post) => {
        post.File = files.find((file) => file.postId === post.id);
    });


    let rawPosts = new Array();
    let file;
    posts.forEach(post => {
        file = undefined;
        if(post.File) {
            file = {
                url: `/cdn/files/${post.File.id}/${post.File.name}.${post.File.extension}`,
                name: `${post.File.name}.${post.File.extension}`,
                mediaType: (mime.lookup(post.File.extension) as string).split('/')[0],
            };
        }

        rawPosts.push({
            id: post.id,
            userId: post.userId,
            nickname: post.User.nickname,
            message: post.message,
            date: post.date,
            file,
        });
    });


    res.json({
        message: 'Success.',
        posts: rawPosts,
    });
};

async function fetchPages(req: Request, res: Response) {
    let rowsCount = await BlogPost.count();

    res.json({
        code: exitCodes.OK,
        count: Math.ceil(rowsCount / PAGINATION),
        pagination: PAGINATION,
    });
};

export default {
    fetchList,
    fetchPages,
};