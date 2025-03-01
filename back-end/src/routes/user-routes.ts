import { Request, Response, Router } from 'express';
import csrf from 'csurf';
import { UserController } from '../controllers/user.controller';
import { verify_session } from './middleware/verify_session';

const userController = new UserController();

const csrfProtect = csrf({cookie: true});

const router = Router();

router.post('/changepassword', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.change_password(req, res));

router.post('/wizard', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.onboard_user(req, res));
router.get('/wizard', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.get_cities(req, res));

router.get('/connect', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.get_new_batch(req, res));
router.post('/connect/interested', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.interested(req, res));
router.post('/connect/not_interested', csrfProtect, verify_session, async (req: Request, res: Response): Promise<void> => userController.not_interested(req, res));

export const UserRoutes: Router = router;
