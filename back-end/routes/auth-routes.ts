import { Request, Response, Router, CookieOptions } from 'express';
import { db } from '../database/database';
import { FirebaseAuthError } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const ENV = process.env.NODE_ENV || 'development';
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

var cookieOptions: CookieOptions =  { maxAge: -1, httpOnly: false, secure: false, sameSite: "lax", domain: 'localhost' };

if (ENV === 'development') {
	cookieOptions = { maxAge: expiresIn, httpOnly: true, secure: false, sameSite: "lax", domain: 'localhost' };
	console.log('Cookies in development mode: secure is off');
  } else {
	cookieOptions = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite: "strict" };
	console.log('Cookies in production mode: secure is on');
};

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

	  db.auth.createSessionCookie(data.idToken, {expiresIn})
			.then(
				async (sessionCookie) => {
					const userProfileRef = db.user_profile;
					const userProfileSnapshot = await userProfileRef.where('user_id', '==', data.localId).limit(1).get();

					if (!userProfileSnapshot.empty && userProfileSnapshot !== undefined) {
						console.log(userProfileSnapshot.docs);
						console.log(data);
						const userProfileData = userProfileSnapshot.docs[0].data();

						res.cookie('session', sessionCookie, cookieOptions);

						if (userProfileData) {
							res.status(200).send({ name: data.name, onboarded: userProfileData.onboarded });
							return;
						} else {
							res.status(400).send({ error: "User profile data is undefined." });
							return;
						}
					} else {
						console.error('User does not have a profile entry');
						res.status(500);
	  					return;
					}
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
		first_name.trim().toLowerCase();
		req.body.displayName = first_name.charAt(0).toUpperCase() + first_name.slice(1);
		const userRecord = await db.auth.createUser(req.body);
		console.log("new user created with uuid: ");
		console.log(userRecord);

		db.user_profile.add({ user_id: userRecord.uid, onboarded: false });

		res.status(200).send('Success!');
		return;
	} catch (err) {
		if (err instanceof FirebaseAuthError) {
			console.error('Error creating account');
			if (err.code == 'auth/email-already-exists') {
				console.error(`${err.message} ${req.body.email}`);
			}
		}
		console.error('Error when creating user account', err);
		res.status(500).send('Error!');
	}
});

router.get(('/verify-session'), async (req: Request, res: Response): Promise<void> => {
	const sessionCookie = req.cookies.session;
	if (sessionCookie === null || sessionCookie === undefined || sessionCookie === 'undefined')
	{
		console.log(`User does not have a session to decode.`);
		res.status(204).json();
		return;
	}

	console.log('decoding users cookie...');
	db.auth
    .verifySessionCookie(sessionCookie, true)
    .then((decodedToken) => {
		res.status(200).json({name: decodedToken.name});
		return;
    })
    .catch((error) => {
		console.log(`Catastrophic error decoding user's cookie: ${error}`);	
		res.status(500).json();
		return
    });
});

router.get('/get_token', async (req: Request, res: Response): Promise<void> => {
	res.status(200).send({ csrfToken: req.csrfToken() });
	return;
});

export const AuthRoutes: Router = router;