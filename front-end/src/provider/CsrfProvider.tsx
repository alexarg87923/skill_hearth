import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CsrfContext = React.createContext<string | null>(null);

export const CsrfProvider =  ({ children }: { children: any }) => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const navigate = useNavigate();

    useEffect(() => {
		console.log('Entering CSRF Provider...');

		const fetchCSRFToken = async () => {
			try { 
				const result = await axios.get('/api/auth/get_token', { withCredentials: true });
				setCsrfToken(result.data.csrfToken);
				console.log('Users csrf token was placed...');
			} catch (err) {
				console.error('Error in protected page, redirecting user to login:', err);
				navigate('/login');
			}
		};

		fetchCSRFToken();
    }, []);

    if (!csrfToken) {
		console.log('CSRF Loading...');
		return <div>Loading...</div>;
    }

	console.log('Returning CSRF Provider children component');
    return (
		<CsrfContext.Provider value={csrfToken}>
			{children}
		</CsrfContext.Provider>
	);
};

export default CsrfContext;