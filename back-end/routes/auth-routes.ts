import { Request, Response, Router } from 'express';

import { db } from '../database/database';

const router = Router();

router.get('/login', (req: Request, res: Response): void => {

	return;
});

router.get('/signup', (req: Request, res: Response): void => {
	return;
});

export const AuthRoutes: Router = router;