import { Router, IRouter } from 'express';
import blogPostController from '../controllers/blog-post.controller';
import authenticateToken from '../middlewares/authenticateToken';

const router: IRouter = Router();


router.get('/api/blog-post/:id(\\d+)', blogPostController.fetchBlogPost);
router.post('/api/blog-post', authenticateToken, blogPostController.createBlogPost);
router.patch('/api/blog-post/:id(\\d+)', authenticateToken, blogPostController.editBlogPost);
router.delete('/api/blog-post/:id(\\d+)', authenticateToken, blogPostController.deleteBlogPost);


export default router;