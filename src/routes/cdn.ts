import { IRouter, Router } from 'express';
import cdnController from '../controllers/cdn.controller';
import { wrapAsyncEndpoint } from '../middlewares/handleErrors';


const router: IRouter = Router();

router.get('/cdn/files/:id(\\d+)/:fileName', wrapAsyncEndpoint(cdnController.fetchFile));


export default router;