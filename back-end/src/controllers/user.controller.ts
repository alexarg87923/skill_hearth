import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CONSTANTS } from "../utils/constants";
import { logger } from '../utils/logger';

export class UserController {
    private userService: UserService;

    constructor() { this.userService = new UserService() }

    async login(req: Request, res: Response): Promise<void> {
        try {
            if (req.cookies.session) {
                logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.COOKIE_EXISTS);
                res.sendStatus(500);
                return;
            }
            
            const userRecord = await this.userService.login(req.body);
            
            if (userRecord) {
                req.session.user = { name:userRecord.first_name, onboarded: userRecord.onboarded };
                res.status(200).json({ name:userRecord.first_name, onboarded: userRecord.onboarded });
                return;
            }
            
            logger.error(CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGIN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        }
    }
    
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const userRecord = await this.userService.signup(req.body);
            
            if (userRecord) {
                res.status(201);
                return;
            }
            
            logger.error(CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC);
            res.sendStatus(500);
        } catch (error) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.SIGNUP + CONSTANTS.ERRORS.CATASTROPHIC}: ` + error);
            res.sendStatus(500);
        }
    }
    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('_csrf');
            res.clearCookie('connect.sid');
            res.sendStatus(200);
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.LOGOUT + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
        }
    }
    async getToken(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).send({ csrfToken: req.csrfToken() });
            return;
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.GET_TOKEN + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    }
    
    async verifySession (req: Request, res: Response): Promise<void> {
        try {
            const sessionCookie = req.cookies['connect.sid'];
            if (sessionCookie === null || sessionCookie === undefined || sessionCookie === 'undefined')
            {
                res.sendStatus(204);
                return;
            }
        } catch (err) {
            logger.error(`${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ` + err);
            res.sendStatus(500);
            return;
        }
    }
}