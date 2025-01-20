import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../provider/UserProvider";

function ProtectedRoute() {
	const { userContext, loading } = useContext(UserContext);

	if (loading) {
		return <div>checking session...</div>;
	}

	if (userContext) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
}

export default ProtectedRoute;
