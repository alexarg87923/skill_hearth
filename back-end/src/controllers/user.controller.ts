import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CONSTANTS } from "../utils/constants";
import { logger } from '../utils/logger';
import { ENV } from '../config/env';
import { verify_session } from "../routes/middleware/verify_session";

export class UserController {
    private userService: UserService;

    constructor() { this.userService = new UserService() };

    async login(req: Request, res: Response): Promise<void> {
        logger.info('Entered login API endpoint...');
        try {
            if (ENV.ENV_MODE === 'development') {
                if (req.body.email === 'admin@unboarded.com' && req.body.password === 'admin') {
                    const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                    res.cookie('admin_cookie', { id: '67a1848b08c4b2e9283735dd', name:'Admin', onboarded: false }, options);
                    res.status(200).json({ user: {name:'Admin', onboarded: false} });
                    return; 
                };

                if (req.body.email == 'admin@onboarded.com' && req.body.password == 'admin') {
                    const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                    res.cookie('admin_cookie', { id: '67a184c2883a10f0133e35c1', name:'Admin', onboarded: true }, options);
                    res.status(200).json({ user: {name:'Admin', onboarded: true} });
                    return; 
                };
            };

            if (req.session.user) {
                logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.COOKIE_EXISTS);
                res.sendStatus(500);
                return;
            };
            
            const userRecord = await this.userService.login(req.body);
            
            if (userRecord) {
                logger.info('Signing in user...');
                req.session.user = { id: userRecord._id, name:userRecord.first_name, onboarded: userRecord.onboarded };
                res.status(200).json({ user: {name:userRecord.first_name, onboarded: userRecord.onboarded} });
                return;
            };

            logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        };
    };

    async signup(req: Request, res: Response): Promise<void> {
        logger.info('Entered signup API endpoint...');
        try {
            const userRecord = await this.userService.signup(req.body);

            if (userRecord) {
                logger.info(`User was successfully made! ${userRecord}`);
                res.sendStatus(201);
                return;
            };

            logger.error(CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        };
    };

    async logout(req: Request, res: Response): Promise<void> {
        logger.info('Entered logout API endpoint...');
        try {
            res.clearCookie('_csrf');
            res.clearCookie('connect.sid');
            res.clearCookie('admin_cookie');
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send('Could not log out');
                };
            });
            logger.info('Successfully cleared all user data...');
            res.sendStatus(200);
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGOUT + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
        };
    };

    async getToken(req: Request, res: Response): Promise<void> {
        logger.info('Entered GetCSRFToken API endpoint...');
        try {
            logger.info('Returning CSRF Token...');
            res.status(200).send({ csrfToken: req.csrfToken() });
            return;
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.GET_TOKEN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        };
    };

    async verifySession (req: Request, res: Response): Promise<void> {
        verify_session(req, res);
    };

    async onboardUser (req: Request, res: Response): Promise<void> {
        logger.info('Entered wizard API endpoint...');
        try {
            const userSession = req.session.user;
            if (userSession !== undefined && userSession) {
                const userProfile = await this.userService.onboard_user(req.body, userSession.id);

                if (userProfile) {
                    logger.info('Successfully created user profile...');
                    res.status(200).json();
                    return;
                };
            }
            
            logger.info('User does not have a session');
            res.sendStatus(403);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        };
    };

    async changepassword (req: Request, res: Response): Promise<void> {
        logger.info('Entered changepassword API endpoint...');
        logger.info('Not implemented...');
        logger.info(req.body);
        try {
            res.status(200).json();
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    };
};