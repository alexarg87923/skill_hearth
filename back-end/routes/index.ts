import { Router } from 'express';

import { AuthRoutes } from './auth-routes';

const router: Router = Router();

router.use('/auth', AuthRoutes);

export const MainRouter: Router = router;