import { Request, Response, NextFunction } from 'express';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { CONSTANTS } from '../../utils/constants';

const returnStatusOrNext = ({
    res,
    status,
    data,
    next
}: {
    res: Response;
    status?: number;
    data?: any;
    next?: NextFunction;
}) => {
    if (next) {
        return next();
    };

    if (data) {
        res.status(status!).json(data);
    } else {
        res.sendStatus(status!);
    };
};

export const verify_session = async (
    req: Request,
    res: Response,
    next?: NextFunction
): Promise<void> => {
    logger.info('Entered verifySession API endpoint...');
    
    try {
        if (ENV.ENV_MODE === 'development' && req.cookies.admin_cookie) {
            logger.info('User is an Admin...');
            const adminCookie = req.cookies.admin_cookie;
            logger.info(`JSON: ${JSON.stringify({ name: adminCookie.name, onboarded: adminCookie.onboarded })}`);
            return returnStatusOrNext({ res, status: 200, data: {
                user: { name: adminCookie.name, onboarded: adminCookie.onboarded }
            }, next });
        };
        
        const userSession = req.session.user;
        
        console.log(userSession);
        
        if (!userSession) {
            logger.info('User does not have a session...');
            return returnStatusOrNext({ res, status: 204, next });
        };
        logger.info('User is not an Admin...');
        logger.info(`JSON: ${JSON.stringify({ user: { name: userSession.name, onboarded: userSession.onboarded } })}`);
        return returnStatusOrNext({
            res,
            status: 200,
            data: {
                user: { name: userSession.name, onboarded: userSession.onboarded }
            },
            next
        });
    } catch (err) {
        logger.error(
            `${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ${err}`
        );
        return returnStatusOrNext({ res, status: 500, next });
    };
};
