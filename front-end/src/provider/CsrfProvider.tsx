import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiAxios from '../components/backend';

const CsrfContext = React.createContext<{csrfToken: string | null, setCsrfToken: Function}>({csrfToken: '', setCsrfToken: () => {}});

export const CsrfProvider =  ({ children }: { children: any }) => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
		console.log('Entering CSRF Provider useEffect...');

		const fetchCSRFToken = async () => {
			try {
                if (location.pathname !== '/logout') {
                    const result = await apiAxios.get('/auth/get_token', { withCredentials: true });
                    console.log('CSRFToken from api: ' + JSON.stringify(result.data))
                    setCsrfToken(result.data.csrfToken);
                    console.log('Users csrf token was placed...');
                }
			} catch (err) {
				console.error('Error in protected page, redirecting user to login:', err);
				navigate('/login');
			}
		};

		fetchCSRFToken();
    }, [location.pathname]);

	console.log('Returning CSRF Provider children component');
    return (
		<CsrfContext.Provider value={{csrfToken, setCsrfToken}}>
			{children}
		</CsrfContext.Provider>
	);
};

export default CsrfContext;