import { IRouter, Router } from 'express';
import cdnController from '../controllers/cdn.controller';

const router: IRouter = Router();

router.get('/cdn/files/:id(\\d+)/:fileName', cdnController.fetchFile);


export default router;