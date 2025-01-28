import React, { useContext, useEffect } from "react"
import UserContext from "../provider/UserProvider";
import axios from 'axios';

const Logout: React.FC = () => {
	const { setUserContext } = useContext(UserContext);

	useEffect(() => {
        console.log("Entered logout...");
		const logout = async () => {
			try {
				await axios.post('/api/auth/logout');
				setUserContext(null);
				localStorage.removeItem('skill-hearth');
				console.log('Successfully logged user out...');
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
};

export default Logout;