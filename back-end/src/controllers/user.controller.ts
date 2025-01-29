import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CONSTANTS } from "../utils/constants";
import { logger } from '../utils/logger';
import { ENV } from '../config/env';
export class UserController {
    private userService: UserService;

    constructor() { this.userService = new UserService() };

    async login(req: Request, res: Response): Promise<void> {
        logger.info('Entered login API endpoint...');
        try {
            if (ENV.ENV_MODE === 'development') {
                if (req.body.email == 'admin@admin.com' && req.body.password == 'admin') {
                    const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                    res.cookie('admin_cookie',{ user: { id: 'test', name:'Alex', onboarded: true }}, options);
                    res.status(200).json({ user: {name:'Admin'}, onboarded: {status: true} });
                    return; 
                }   
            }

            if (req.session.user) {
                logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.COOKIE_EXISTS);
                res.sendStatus(500);
                return;
            };

            const userRecord = await this.userService.login(req.body);

            if (userRecord) {
                req.session.user = { id: userRecord._id, name:userRecord.first_name, onboarded: userRecord.onboarded };
                res.status(200).json({ user: {name:userRecord.first_name}, onboarded: {status: userRecord.onboarded} });
                return;
            };

            logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        }
    };

    async signup(req: Request, res: Response): Promise<void> {
        logger.info('Entered signup API endpoint...');
        try {
            const userRecord = await this.userService.signup(req.body);

            if (userRecord) {
                res.sendStatus(201);
                return;
            }

            logger.error(CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        }
    };

    async logout(req: Request, res: Response): Promise<void> {
        logger.info('Entered logout API endpoint...');
        try {
            req.session.destroy(err => {
                if (err) {
                  res.clearCookie('connect.sid');
                  return res.status(500).send('Could not log out');
                }
            });

            res.clearCookie('_csrf');
            res.clearCookie('connect.sid');
            res.sendStatus(200);
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGOUT + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
        }
    };

    async getToken(req: Request, res: Response): Promise<void> {
        logger.info('Entered GetCSRFToken API endpoint...');
        try {
            res.status(200).send({ csrfToken: req.csrfToken() });
            return;
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.GET_TOKEN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    };
    
    async verifySession (req: Request, res: Response): Promise<void> {
        logger.info('Entered verifySession API endpoint...');
        try {
            if (ENV.ENV_MODE === 'development') {
                if (req.cookies.admin_cookie) {
                    logger.info(req.cookies.admin_cookie)
                    res.status(200).json(req.cookies.admin_cookie);
                    return;
                }
            }

            const userSession = req.session.user;

            console.log(userSession);

            if (userSession === null || userSession === undefined)
            {
                logger.info('User does not have a session...');
                res.sendStatus(204);
                return;
            };

            if (!userSession.onboarded) {
                logger.info('User has not been onboarded...');
                res.status(200).json({ user: {name:userSession.name}, onboarded: {status: userSession.onboarded} });
                return;
            };
    
            res.status(200).json({ user: {name: userSession.name} });
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    };
};