import React, { useContext, useEffect } from "react"
import UserContext from "../provider/UserProvider";
import axios from 'axios';
import CsrfContext from '../provider/CsrfProvider';

const Logout: React.FC = () => {
	const { setUserContext } = useContext(UserContext);
	const csrfToken = useContext(CsrfContext);

	useEffect(() => {
		const logout = async () => {
			try {
				const response = await axios.post('/api/logout', {
					headers: {
						'CSRF-Token': csrfToken
					}
				});
	
				if (response.status === 200) {
					localStorage.removeItem('skill-hearth');
					setUserContext(null);
				}
			} catch (err) {
				console.error("There was an error hitting the logout endpoint", err);
				alert('There was an error logging you out');
			}
		};

		logout();
	}, []);

	return (
		<div>You have been successfully logged out</div>
	)
}

export default Logout;