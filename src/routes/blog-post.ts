import { Router, IRouter } from 'express';
import blogPostController from '../controllers/blog-post.controller';
import authenticateToken from '../middlewares/authenticateToken';
import multer from 'multer';
import { wrapAsyncEndpoint } from '../middlewares/handleErrors';


const router: IRouter = Router();

const upload = multer();
router.get('/api/blog-post/:id(\\d+)', wrapAsyncEndpoint(blogPostController.fetchBlogPost));
router.post('/api/blog-post', authenticateToken, upload.single('file'), wrapAsyncEndpoint(blogPostController.createBlogPost));
router.patch('/api/blog-post/:id(\\d+)', authenticateToken, upload.single('file'), wrapAsyncEndpoint(blogPostController.editBlogPost));
router.delete('/api/blog-post/:id(\\d+)', authenticateToken, wrapAsyncEndpoint(blogPostController.deleteBlogPost));


export default router;