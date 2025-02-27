import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CONSTANTS } from "../utils/constants";
import { logger } from '../utils/logger';
import { ENV } from '../config/env';
import { verify_session } from "../routes/middleware/verify_session";
import { CityService } from "../services/city.service";

export class UserController {
    private userService: UserService;
    private cityService: CityService;

    constructor() { this.userService = new UserService(), this.cityService = new CityService() };

    async login(req: Request, res: Response): Promise<void> {
        logger.info('Entered login API endpoint...');
        try {
            if (ENV.ENV_MODE === 'development') {
                if (req.body.email === 'admin@unboarded.com' || req.body.email === 'admin@onboarded.com') {
                    const adminRecord = await this.userService.login(req.body);
                    if(adminRecord) {
                        const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                        res.cookie('admin_cookie', { id: adminRecord._id, name:adminRecord.first_name, onboarded: adminRecord.onboarded, interests: adminRecord.interests, skills: adminRecord.interests }, options);
                        res.status(200).json({ user: {name:adminRecord.first_name, onboarded: adminRecord.onboarded} });
                        return;
                    };
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
                req.session.user = { id: userRecord._id, name:userRecord.first_name, onboarded: userRecord.onboarded, interests: userRecord.interests, skills: userRecord.interests };
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

    async sign_up(req: Request, res: Response): Promise<void> {
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

    async get_token(req: Request, res: Response): Promise<void> {
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

    async verify_session (req: Request, res: Response): Promise<void> {
        verify_session(req, res);
    };

    async get_cities (req: Request, res: Response): Promise<void> {
        logger.info('Entered /api/wizard GET');
        try {
            const cities = await this.cityService.get_cities();
            res.status(200).send(cities)
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        }
    };

    async onboard_user (req: Request, res: Response): Promise<void> {
        logger.info('Entered /api/wizard POST');
        try {
            if (ENV.ENV_MODE === 'development' && req?.cookies?.admin_cookie) {
                const admin_cookie = req.cookies.admin_cookie;
                console.log(admin_cookie);
                if (admin_cookie.id === '67a815fba256a816908597ab') {
                    logger.info('This user is not allowed to onboard...');
                    res.sendStatus(403);
                    return;
                };

                const adminProfile = await this.userService.onboard_user(req.body, admin_cookie.id);
                if (adminProfile) {
                    logger.info('Onboarding admin account...');
                    const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                    res.cookie('admin_cookie', { id: adminProfile._id, name:adminProfile.first_name, onboarded: adminProfile.onboarded, interests: adminProfile.interests, skills: adminProfile.interests }, options);
                    res.status(200).json({ user: {name:adminProfile.first_name, onboarded: adminProfile.onboarded} });
                    return;
                };
            };

            const userSession = req.session.user;
            if (userSession !== undefined) {
                console.log(userSession)
                const userProfile = await this.userService.onboard_user(req.body, userSession.id);

                if (userProfile) {
                    logger.info('Successfully created user profile...');
                    req.session.user = { id: userProfile._id, name:userProfile.first_name, onboarded: userProfile.onboarded, interests: userProfile.interests, skills: userProfile.interests };
                    res.status(200).json({ user: {name:userProfile.first_name, onboarded: userProfile.onboarded} });
                    return;
                };
            };

            logger.info('Was not able to update user profile, user might not have a session');
            res.sendStatus(403);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        };
    };

    async change_password (req: Request, res: Response): Promise<void> {
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

    async get_new_batch (req: Request, res: Response): Promise<void> {
        logger.info('Entered get_new_batch API endpoint...');
        try {
            const userSession = req.session.user;

            if (userSession !== undefined) {
                const new_batch = await this.userService.get_new_batch(userSession.id, userSession.interests, userSession.skills);
                if (new_batch !== undefined && new_batch !== null) {
                    if (new_batch.length === 0) {
                        res.sendStatus(200);
                        return;
                    };
                    res.status(200).json(new_batch);
                    return;
                };

                res.sendStatus(403);
                return;
            };
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    };
};