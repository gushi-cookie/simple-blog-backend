import { Router, IRouter } from 'express';
import authController from '../controllers/auth.controller';


const router: IRouter = Router();

router.post('/api/login', authController.signIn);
router.post('/api/register', authController.signUp);

export default router;