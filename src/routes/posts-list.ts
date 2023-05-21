import { IRouter, Router } from 'express';
import postsListController from '../controllers/posts-list.controller';

const router: IRouter = Router();

router.get('/api/posts-list/pages', postsListController.fetchPages);
router.get('/api/posts-list', postsListController.fetchList);

export default router;