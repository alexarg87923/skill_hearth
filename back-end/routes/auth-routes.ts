import { Request, Response, Router } from 'express';
import { db } from '../database/database';
import { FirebaseAuthError } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
	var userRecord = await db.auth.getUserByEmail(req.body.email);

	if (userRecord === null || userRecord === undefined) {
		console.log(`User attempted login but doesn't exist with email: ${req.body.email}`);
		res.status(401).send('User does not exist.');
		return;
	};

	const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
	const payload = {
	  email: req.body.email,
	  password: req.body.password,
	  returnSecureToken: true,
	};
  
	try {
	  const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload)
	  });
  
	  if (!response.ok) {
		const error = await response.json();
		console.error('Error verifying password:', error);
		res.status(response.status);
		return;
	  }
  
	  const data = await response.json();
	  console.log('Password verified successfully:');

	  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
	  db.auth.createSessionCookie(data.idToken, {expiresIn})
		  .then(
		  (sessionCookie) => {
			  const options = { maxAge: expiresIn, httpOnly: true, secure: true };
			  res.cookie('session', sessionCookie, options);
			  res.status(200).send('Success!');
			  return;
		  },
		  (error) => {
			  console.log(`Error logging user in: ${error}`);
			  res.status(401).send('UNAUTHORIZED REQUEST!');
			  return;
		  });
  
	  res.status(500);
	  return;
	} catch (error) {
	  console.error('Error verifying password:', error);
	  throw error;
	}
});

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
	const { first_name, middle_name, last_name, email, password } = req.body; 
	
	if (!first_name || !last_name || !email || !password) {
		res.status(500).send('Missing Fields on sign up.')
		return;
	}
	try {
		req.body.displayName = middle_name ? `${first_name.trim()} ${middle_name.trim()} ${last_name.trim()}` : `${first_name.trim()} ${last_name.trim()}`;
		const userRecord = await db.auth.createUser(req.body);
		console.log("new user created with uuid: ");
		console.log(userRecord);
		res.status(200).send('Success!');
		return;
	} catch (err) {
		if (err instanceof FirebaseAuthError) {
			console.error('Error creating account');
			if (err.code == 'auth/email-already-exists') {
				console.error(`${err.message} ${req.body.email}`);
			}
		}
		res.status(500).send('Error!');
	}
});

export const AuthRoutes: Router = router;