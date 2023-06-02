import { IRouter, Router } from 'express';
import postsListController from '../controllers/posts-list.controller';
import { wrapAsyncEndpoint } from '../middlewares/handleErrors';


const router: IRouter = Router();

router.get('/api/posts-list/pages', wrapAsyncEndpoint(postsListController.fetchPages));
router.get('/api/posts-list', wrapAsyncEndpoint(postsListController.fetchList));

export default router;