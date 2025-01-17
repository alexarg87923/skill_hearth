import { Request, Response } from 'express';
import { db } from '../database/database';

export const Authenticate = async (req: Request, res: Response): Promise<void> => {
	const sessionCookie = req.cookies.session;

	if (sessionCookie === null || sessionCookie === undefined)
	{
		console.log(`User attempted to visit a protected page.`);	
		res.status(401);
		return;
	}
	console.log('verifying users cookie');
	db.auth
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
		res.status(200).json('Success!');
		return;
    })
    .catch((error) => {
		console.log(`Error loggin in user: ${error}`);	
		res.status(401);
		return
    });
}