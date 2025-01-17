import { Router } from 'express';
import { Authenticate } from '../middleware/authenticate';

const router = Router();

router.get('/dashboard', Authenticate);
router.get('/profile', Authenticate);
router.get('/chats', Authenticate);

export const UserRoutes: Router = router;