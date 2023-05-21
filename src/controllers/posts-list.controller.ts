import { Request, Response } from 'express';
import { BlogPost } from '../models/blog-post.model';
import { User } from '../models/user.model';


const PAGINATION = 20;

interface AssocBlogPost extends BlogPost {
    User: User;
}

async function fetchList(req: Request, res: Response) {
    // available query params: page
    let pageNumber = Number(req.query.page);
    if(!pageNumber) pageNumber = 0;

    let result = await BlogPost.findAndCountAll({
        order: ['date'],
        limit: PAGINATION,
        offset: PAGINATION * pageNumber,
        include: User,
    });
    if(result.rows.length === 0) return res.status(404).json('List not found.');

    let posts = new Array<AssocBlogPost>();
    result.rows.forEach(row => {
        posts.push((row as any));
    });

    let rawPosts = new Array();
    posts.forEach(post => {
        rawPosts.push({
            id: post.id,
            userId: post.userId,
            nickname: post.User.nickname,
            message: post.message,
            date: post.date,
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
        count: Math.ceil(rowsCount / PAGINATION),
        pagination: PAGINATION,
    });
};

export default {
    fetchList,
    fetchPages,
};