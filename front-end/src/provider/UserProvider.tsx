import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
	const local_storage = localStorage.getItem("skill-hearth");
	const [userContext, setUserContext] = useState<any | null>(local_storage ? JSON.parse(local_storage) : null);
	const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    console.log("Local Storage: ", local_storage);
    console.log("Entering User Provider...");
    console.log("User context: ", userContext);

	useEffect(() => {
		let isMounted = true;

		const verifyAndDecodeCookie = async () => {
            if (location.pathname === '/logout') return;
			try {
                if (isMounted) {
                    console.log("User Provider is mounted...");

                    const response = await axios.get('/api/auth/verify-session', { withCredentials: true });
                    console.log(response);
                    if (!response.data.user || Object.keys(response.data.user).length === 0) {
                        console.log("Session came back empty: ", response.data);
                        setUserContext(null);
                        localStorage.removeItem("skill-hearth");
                    } else {
                        console.log("API returned successful request with data: ", response.data.user);
                        setUserContext(response.data.user);
                        localStorage.setItem("skill-hearth", JSON.stringify(response.data.user));
                        if (response.data.onboarded !== undefined && !response.data?.onboarded?.status) {
                            navigate('/setupwizard');
                        }
                    }
                }
			} catch (err) {
				if (isMounted) {
					setUserContext(null);
                    localStorage.removeItem("skill-hearth");
					console.log("User Provider failed to verify session, user set to null...", err);
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
	}, [location.pathname]);

	console.log("Returning Provider children component...");
	return (
		<UserContext.Provider value={{userContext, loading, setUserContext}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;