import React, { useContext, useEffect } from "react";
import UserContext from "../provider/UserProvider";
import backend from "../components/backend";

const Logout: React.FC = () => {
    const { Logout } = useContext(UserContext);

    useEffect(() => {
        console.log("Entered logout...");
        Logout();
        console.log("Ran userContext Logout function...");
        const logout = async () => {
            try {
                await backend.post("/auth/logout");
                console.log("Successfully hit logout api...");
            } catch (err) {
                console.error(
                    "There was an error hitting the logout endpoint",
                    err
                );
                alert("There was an error logging you out");
            }
        };

        logout();
    }, [Logout]);

    return <div className="pt-16">You have been successfully logged out</div>;
};

export default Logout;
