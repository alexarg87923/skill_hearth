import { Request, Response, Router } from 'express';
import csrf from 'csurf';
import { UserController } from '../controllers/user.controller';
import { verify_session } from './middleware/verify_session';

const userController = new UserController();

const csrfProtect = csrf({cookie: true});

const router = Router();


router.post('/changepassword', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.changepassword(req, res));

router.post('/wizard', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.onboardUser(req, res));

// router.post('/dashboard', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => );

export const UserRoutes: Router = router;
