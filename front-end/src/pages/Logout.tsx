import React, { useContext, useEffect } from "react"
import UserContext from "../provider/UserProvider";
import axios from 'axios';

const Logout: React.FC = () => {
	const { setUserContext } = useContext(UserContext);
	useEffect(() => {
		const logout = async () => {
			try {
				const response = await axios.get('/api/auth/logout');
	
				if (response.status == 200) {
					setUserContext(null);
					localStorage.removeItem('skill-hearth');
					alert('Successfully logged out!');
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