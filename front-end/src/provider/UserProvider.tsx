import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
	name: string;
	profile_picture?: string;
	bio: string;
	skillset: [];
}

interface UserContextProps {
	userContext: null | User;
	setUserContext: Function;
	loading: boolean;
}
  

const UserContext = React.createContext<UserContextProps>({
	userContext: null,
	setUserContext: () => {},
	loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	console.log("Entering User Provider...");
	const local_storage = localStorage.getItem("skill-hearth");
	const [userContext, setUserContext] = useState<any | null>(local_storage ? JSON.parse(local_storage) : null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const verifyAndDecodeCookie = async () => {
			try {
				if (userContext && Object.keys(userContext).length > 0) {
					console.log("User has context, updating local storage...");
					localStorage.setItem("skill-hearth", JSON.stringify(userContext));
				} else {
					console.log("User does not have context, clearing local storage...");
					localStorage.removeItem("skill-hearth");
				}

				console.log("User context: ", userContext);
				if (!userContext) {
					const response = await axios.get('/api/auth/verify-session', { withCredentials: true });
					if (isMounted) {
						console.log("User Provider is mounted...");
						if (response.data && Object.keys(response.data).length > 0) {
							console.log("API returned successful request with data: ", response.data);
							setUserContext(response.data);
							localStorage.setItem("skill-hearth", JSON.stringify(response.data));
						} else {
							setUserContext(null);
						  	console.log("User Provider: empty user data response from server");
						}
					}
				}
			} catch (err) {
				if (isMounted) {
					setUserContext(null);
					console.log("User Provider failed to verify session, user set to null...");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
					console.log("User loading set to false...");
				}
			}
		}
		
		verifyAndDecodeCookie();
		return () => {
			isMounted = false;
		};
	}, [userContext]);

	console.log("Returning Provider children component...");
	return (
		<UserContext.Provider value={{userContext, loading, setUserContext}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;