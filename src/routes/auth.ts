import { Router, IRouter } from 'express';
import authController from '../controllers/auth.controller';
import { wrapAsyncEndpoint } from '../middlewares/handleErrors';


const router: IRouter = Router();

router.post('/api/login', wrapAsyncEndpoint(authController.signIn));
router.post('/api/register', wrapAsyncEndpoint(authController.signUp));

export default router;