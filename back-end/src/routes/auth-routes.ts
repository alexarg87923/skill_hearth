import { Request, Response, Router } from 'express';
import csrf from 'csurf';
import { UserController } from '../controllers/user.controller';

const userController = new UserController();

const csrfProtect = csrf({cookie: true});

const router = Router();


router.post('/login', csrfProtect, async (req: Request, res: Response): Promise<void> => userController.login(req, res));

router.post('/signup', csrfProtect, async (req: Request, res: Response): Promise<void> => userController.signup(req, res));

router.get('/verify-session', csrfProtect, async (req: Request, res: Response): Promise<void> => userController.verifySession(req, res));

router.get('/get_token', csrfProtect, async (req: Request, res: Response): Promise<void> => userController.getToken(req, res));

// csrf protection not needed for logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => userController.logout(req, res));

export const AuthRoutes: Router = router;