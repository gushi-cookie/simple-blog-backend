import { Router, IRouter } from 'express';
import blogPostController from '../controllers/blog-post.controller';

const router: IRouter = Router();


router.post('/api/blog-post', blogPostController.postBlogPost);

router.get('/api/blog-post/:id', blogPostController.fetchBlogPost);

router.delete('/api/blog-post/:id', blogPostController.deleteBlogPost);

router.patch('/api/blog-post/:id', blogPostController.editBlogPost);


export default router;