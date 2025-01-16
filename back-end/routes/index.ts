import { Router } from 'express';
import csrf from 'csurf';
import { AuthRoutes } from './auth-routes';
import { CSRFRoutes } from './CSRFRoutes';

const csrfProtect = csrf({cookie: true});
const router: Router = Router();

router.use('/auth', csrfProtect, AuthRoutes);
router.use('/csrf', csrfProtect, CSRFRoutes);

export const MainRouter: Router = router;