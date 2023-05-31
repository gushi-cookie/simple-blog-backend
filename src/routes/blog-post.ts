import { Router, IRouter } from 'express';
import blogPostController from '../controllers/blog-post.controller';
import authenticateToken from '../middlewares/authenticateToken';
import multer from 'multer';

const router: IRouter = Router();

const upload = multer();
router.get('/api/blog-post/:id(\\d+)', blogPostController.fetchBlogPost);
router.post('/api/blog-post', authenticateToken, upload.single('file'), blogPostController.createBlogPost);
router.patch('/api/blog-post/:id(\\d+)', authenticateToken, upload.single('file'), blogPostController.editBlogPost);
router.delete('/api/blog-post/:id(\\d+)', authenticateToken, blogPostController.deleteBlogPost);


export default router;