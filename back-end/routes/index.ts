import { Router, Request, Response } from 'express';
import csrf from 'csurf';
import { AuthRoutes } from './auth-routes';

const csrfProtect = csrf({cookie: true});
const router: Router = Router();

router.use('/auth', csrfProtect, AuthRoutes);

// csrf protection not needed
router.post('/logout', (req: Request, res: Response) => {
	try {
		res.clearCookie('session');
		res.clearCookie('_csrf');
		console.log('Logged out successfully...');
		res.status(200).send();
	} catch (err) {
		console.error('Error logging out', err);
		res.status(500).send('Failed to log out');
	}
});

export const MainRouter: Router = router;