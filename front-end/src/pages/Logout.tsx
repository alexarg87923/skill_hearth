import React, { useContext, useEffect } from "react"
import UserContext from "../provider/UserProvider";
import axios from 'axios';

const Logout: React.FC = () => {
	const { setUserContext } = useContext(UserContext);

	useEffect(() => {
        console.log("Entered logout...");
        localStorage.removeItem('skill-hearth');
        setUserContext(null);
        console.log('Cleared Local Storage...');
		const logout = async () => {
			try {
				await axios.post('/api/auth/logout');
				console.log('Successfully hit logout api...');
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