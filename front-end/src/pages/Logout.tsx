import React, { useContext, useEffect } from "react"
import UserContext from "../provider/UserProvider";

const Logout: React.FC = () => {
	const { setUserContext } = useContext(UserContext);
	useEffect(() => {
		setUserContext(null);
	}, []);

	return (
		<div>You have been successfully logged out</div>
	)
}

export default Logout;