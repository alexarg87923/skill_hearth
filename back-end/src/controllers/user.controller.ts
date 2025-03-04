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

    async login (req: Request, res: Response): Promise<void> {
        logger.info('Entered login API endpoint...');
        try {
            if (ENV.ENV_MODE === 'development') {
                if (req.body.email === 'admin@unboarded.com' || req.body.email === 'admin@onboarded.com') {
                    const adminRecord = await this.userService.login(req.body);
                    if(adminRecord) {
                        const options = { maxAge: 60 * 60 * 24 * 5 * 1000, httpOnly: false, secure: false };
                        res.cookie('admin_cookie', { id: adminRecord._id, name:adminRecord.first_name, onboarded: adminRecord.onboarded, interests: adminRecord.interests, skills: adminRecord.skills }, options);
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
                req.session.user = { id: userRecord._id, name:userRecord.first_name, onboarded: userRecord.onboarded, interests: userRecord.interests, skills: userRecord.skills };
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

    async sign_up (req: Request, res: Response): Promise<void> {
        logger.info('Entered signup API endpoint...');
        try {
            const createdUserRecord = await this.userService.signup(req.body);

            if (createdUserRecord) {
                logger.info(`User was successfully made! ${createdUserRecord}`);
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
                    res.cookie('admin_cookie', { id: adminProfile._id, name:adminProfile.first_name, onboarded: adminProfile.onboarded, interests: adminProfile.interests, skills: adminProfile.skills }, options);
                    res.status(200).json({ user: {name:adminProfile.first_name, onboarded: adminProfile.onboarded} });
                    return;
                };
            };

            const userSession = req.session.user;
            if (userSession !== undefined) {
                const completedUserProfile = await this.userService.onboard_user(req.body, userSession.id);

                if (completedUserProfile) {
                    logger.info('Successfully created user profile...');

                    //
                    //
                    //  TODO: send email verification here
                    //
                    //

                    this.userService.send_email_verification(userSession.id);

                    req.session.user = { id: completedUserProfile._id, name:completedUserProfile.first_name, onboarded: completedUserProfile.onboarded, interests: completedUserProfile.interests, skills: completedUserProfile.skills };
                    res.status(200).json({ user: {name:completedUserProfile.first_name, onboarded: completedUserProfile.onboarded} });
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
            const matchCache = req.session.match_cache;

            if (userSession !== undefined) {
                if (matchCache) { // check if we previously cached list of users so we don't repeat computation in this session
                    if (matchCache.length > 3) {
                        const [arr1, arr2] = [matchCache.slice(0, 3), matchCache.slice(3)]
                        res.status(200).json(arr1)
                        req.session.match_cache = arr2;
                        return;
                    };
                };

                const batch_of_users = await this.userService.get_new_batch(userSession.id, userSession.interests, userSession.skills);
                if (batch_of_users !== undefined && batch_of_users !== null) {
                    if (batch_of_users.length <= 0) { // if there are no more users to discover, return success with no list of users
                        res.sendStatus(200);
                        return;
                    };

                    if (batch_of_users.length > 3) { 
                        const [arr1, arr2] = [batch_of_users.slice(0, 3), batch_of_users.slice(3)]
                        res.status(200).json(arr1)
                        req.session.match_cache = arr2;
                        return;
                    };

                    res.status(200).json(batch_of_users); // return the batch if it's less than 3
                    return;
                };

                res.sendStatus(403);
                return;
            };
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        };
    };

    async interested (req: Request, res: Response): Promise<void> {
        logger.info(`Entered interested API endpoint: ${JSON.stringify(req.body)}...`);
        try {
            const userSession = req.session.user;
            if (userSession) {
                const replacement_user = await this.userService.handle_interested(userSession.id, req.body.user_id);
                if (replacement_user !== undefined && replacement_user !== null) {
                    res.send(200).json(replacement_user);
                };
                res.sendStatus(200);
                return;
            };
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.INTERESTED + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        };
    };
    
    async not_interested (req: Request, res: Response): Promise<void> {
        logger.info(`Entered not interested API endpoint: ${JSON.stringify(req.body)}...`);
        try {

        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.NOT_INTERESTED + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        };
    };

    async verify_email (req: Request, res: Response): Promise<void> {
        logger.info(`Entered verify email API endpoint: ${JSON.stringify(req.body)}...`);
        try {
            const token = req.params.token;
            const response = await this.userService.verify_token(token);
            if (response) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            };
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_EMAIL + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        };
    };

};