import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CsrfContext = React.createContext<string | null>(null);

export const CsrfProvider =  ({ children }: { children: any }) => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const navigate = useNavigate();

    useEffect(() => {
		const fetchCSRFToken = async () => {
			try { 
				const result = await axios.get('/api/auth/get_token', { withCredentials: true });
				setCsrfToken(result.data.csrfToken);
			} catch (err) {
				console.error('Error in protected page:', err);
				navigate('/login');
			}
		};

		fetchCSRFToken();
    }, []);

    if (!csrfToken) {
      return <div>Loading...</div>;
    }

    return (
		<CsrfContext.Provider value={csrfToken}>
			{children}
		</CsrfContext.Provider>
	);
};

export default CsrfContext;