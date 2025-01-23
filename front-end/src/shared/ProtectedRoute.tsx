import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../provider/UserProvider";

function ProtectedRoute() {
	const { userContext, loading } = useContext(UserContext);
	console.log("in Protected Routes...", userContext);

	if (loading) {
		console.log('Protected Routes Loading...');
		return <div>Loading session, please wait...</div>;
	}

	if (!userContext || Object.keys(userContext).length === 0) {
		console.log('User attempted to visit protected page...');	
		return <Navigate to="/login" replace />;
	}

	console.log('Returning Protected Routes Outlet...');
	return <Outlet />;
}

export default ProtectedRoute;
