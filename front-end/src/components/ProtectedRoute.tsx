import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import UserContext from "../provider/UserProvider";

function ProtectedRoute() {
    const { userContext, loading } = useContext(UserContext);
    const location = useLocation();
    console.log("in Protected Routes...", userContext);

    if (loading) {
        console.log("Protected Routes Loading...");
        return <div>Loading session, please wait...</div>;
    }

    if (!userContext || Object.keys(userContext).length === 0) {
        console.log("User attempted to visit protected page...");
        return <Navigate to="/login" replace />;
    }

    if (!userContext.onboarded && location.pathname !== "/setupwizard") {
        console.log(
            `User is being sent to the wizard:\nOnboarded:${userContext.onboarded}, Pathname: ${location.pathname}`
        );
        return <Navigate to="/setupwizard" replace />;
    }

    if (userContext.onboarded && location.pathname === "/setupwizard") {
        console.log("User is being sent to dashboard from wizard");
        return <Navigate to="/dashboard" replace />;
    }

    console.log("Returning Protected Routes Outlet...");
    return <Outlet />;
}

export default ProtectedRoute;
