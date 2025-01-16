import { Request, Response, Router } from 'express';

const router = Router();

router.get('/get_token', async (req: Request, res: Response): Promise<void> => {
	res.status(200).send({ csrfToken: req.csrfToken() });
	return;
});

export const CSRFRoutes: Router = router;