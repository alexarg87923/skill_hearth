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
            logger.info(`JSON: ${JSON.stringify(adminCookie)}`);
            return returnStatusOrNext({ res: res, status: 200, data: {
                user: adminCookie
            }, next });
        };
        
        const userSession = req.session.user;
        logger.info(`Session JSON: ${JSON.stringify(userSession)}`);

        if (!userSession) {
            logger.info('User does not have a session...');
            res.sendStatus(204);
            return;
        };
        logger.info('User is not an Admin...');
        return returnStatusOrNext({
            res,
            status: 200,
            data: {user: userSession},
            next
        });
    } catch (err) {
        logger.error(
            `${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ${err}`
        );
        res.sendStatus(500);
        return;
    };
};
