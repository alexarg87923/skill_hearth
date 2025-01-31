import { Router } from 'express';
import { AuthRoutes } from './auth-routes';
import { UserRoutes } from './user-routes';


const router: Router = Router();

router.use('/auth', AuthRoutes);

router.use('/user', UserRoutes);

export const MainRouter: Router = router;