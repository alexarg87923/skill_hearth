import { Router } from 'express';
import csrf from 'csurf';
import { AuthRoutes } from './auth-routes';

const csrfProtect = csrf({cookie: true});
const router: Router = Router();

router.use('/auth', csrfProtect, AuthRoutes);

export const MainRouter: Router = router;