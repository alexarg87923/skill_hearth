import { Request, Response, Router } from 'express';
import User from '../types/User'
import { db } from '../database/database';
import { doc, setDoc, addDoc } from "firebase/firestore"; 

const router = Router();

router.get('/login', async (req: Request, res: Response): Promise<void> => {
	// var test_user = {
	// 	uuid: 'test',
	// 	first_name: 'test',
	// 	middle_name: 'test',
	// 	last_name: 'test',
	// 	email: 'test',
	// 	password: 'test',
	// 	created_at: new Date() as Date
	// };
	// console.log("Added user: ");
	// console.log(await db.users.add(test_user));

	var get_users = await db.users.get();
	console.log(get_users.docs[0].id);

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

	return;
});

router.get('/signup', (req: Request, res: Response): void => {
	return;
});

export const AuthRoutes: Router = router;