import { Request, Response, Router } from 'express';

import { db } from '../database/database';

const router = Router();

router.get('/login', (req: Request, res: Response): void => {
	db.users.get();

	return;
});

router.post('/signup', (req: Request, res: Response): void => {
	return;
});

export const AuthRoutes: Router = router;