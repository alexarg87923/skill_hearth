import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserContextProps {
	userContext: null | {};
	setUserContext: Function;
	loading: boolean;
}
  

const UserContext = React.createContext<UserContextProps>({
	userContext: null,
	setUserContext: () => {},
	loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [userContext, setUserContext] = useState<any | null>(localStorage.getItem("skill-hearth") || null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const verifyAndDecodeCookie = async () => {
			try {
				console.log(userContext);
				if (!userContext) {
					const response = await axios.get('/api/auth/verify-session', { withCredentials: true });
					if (isMounted) {
						if (response.data && Object.keys(response.data).length > 0) {
							setUserContext(response.data);
							localStorage.setItem("skill-hearth", response.data);
						  	console.log("user: ", response.data);
						} else {
							setUserContext(null);
						  	console.log("empty user data response from server");
						}
					}
				}
			} catch (err) {
				if (isMounted) {
					setUserContext(null);
					console.log("failed to verify session, user set to null");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
					console.log("loading set to false");
				}
			}
		}
		
		verifyAndDecodeCookie();

		return () => {
			isMounted = false;
		};
	}, [userContext]);

	return (
		<UserContext.Provider value={{userContext, loading, setUserContext}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;