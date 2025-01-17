import { Router } from 'express';
import csrf from 'csurf';
import { AuthRoutes } from './auth-routes';
import { CSRFRoutes } from './csrf-routes';
import { UserRoutes } from './user-routes';

const csrfProtect = csrf({cookie: true});
const router: Router = Router();

router.use('/auth', csrfProtect, AuthRoutes);
router.use('/csrf', csrfProtect, CSRFRoutes);
router.use('/', csrfProtect, UserRoutes);

export const MainRouter: Router = router;