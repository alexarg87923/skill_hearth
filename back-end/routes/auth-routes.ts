import { Request, Response, Router } from 'express';
import User from '../types/User'
import { db } from '../database/database';

const router = Router();

router.get('/login', async (req: Request, res: Response): Promise<void> => {
	// get specific row
	// var test_user_id = get_users.docs[0].id;

	// const usersRef = db.users;
	// const userDocRef = usersRef.doc(get_users.docs[0].id);

	// userDocRef.get().then(doc => {
	// if (doc.exists) {
	// 	const userData = doc.data();
	// 	console.log(userData); 
	// } else {
	// 	console.log('No such document!');
	// 	}
	// });

	// get auth user
	// console.log(await db.auth.getUsers([{ uid: test_user_id }]));

	console.log(req.csrfToken());

	var get_users = await db.auth.getUserByEmail('test@test')
	var user_id = get_users.uid;

	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
	
	db.auth.createSessionCookie(user_id, {expiresIn})
		.then(
		(sessionCookie) => {
			const options = { maxAge: expiresIn, httpOnly: true, secure: true };
			res.cookie('session', sessionCookie, options);
			res.status(200).send('Success!');
		},
		(error) => {
			console.log(`Error logging user in: ${error}`);
			res.status(401).send('UNAUTHORIZED REQUEST!');
		});


	res.status(500);
	return;
});

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
	var test_user = {
		first_name: 'test',
		middle_name: 'test',
		last_name: 'test',
		email: 'test@test.com',
		password: 'valid_password',
		onboarded: false,
		created_at: new Date() as Date
	};
	// console.log("Added user: ");
	// console.log(await db.users.add(test_user));

	var get_users = await db.users.get();
	console.log(get_users.docs[0].id);

	var test_user_id = get_users.docs[0].id;

	const usersRef = db.users;
	const userDocRef = usersRef.doc(get_users.docs[0].id);

	userDocRef.get().then(doc => {
	if (doc.exists) {
		const userData = doc.data();
		console.log(userData); 
	} else {
		console.log('No such document!');
		}
	});

	console.log("new user uuid: ")
	console.log(await db.auth.createUser(test_user));


	console.log(await db.auth.getUsers([{ uid: test_user_id }]));
	

	res.status(200);
	return;
});

export const AuthRoutes: Router = router;