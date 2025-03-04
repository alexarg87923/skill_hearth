import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backend from "../components/backend";
import axios from "axios";

function useUserContextState(init?: User | null) {
    const local_storage = localStorage.getItem("skill-hearth");
    const [userContext, setUserContext] = useState(
        (local_storage ? JSON.parse(local_storage) : null) || init
    );

    function Login(userData: User) {
        setUserContext(userData);
        localStorage.setItem("skill-hearth", JSON.stringify(userData));
    }

    function Logout() {
        setUserContext(null);
        localStorage.removeItem("skill-hearth");
    }

    return [userContext, Login, Logout];
}

interface User {
    name: string;
    profile_picture?: string;
    onboarded: boolean;
}

interface UserContextProps {
    userContext: null | User;
    Login: (userData: User) => void;
    Logout: () => void;
    loading: boolean;
}

const UserContext = React.createContext<UserContextProps>({
    userContext: null,
    Login: () => {},
    Logout: () => {},
    loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userContext, Login, Logout] = useUserContextState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Entering User Provider...");
        console.log("User context: ", userContext);

        const controller = new AbortController();
        const signal = controller.signal;

        const verifyAndDecodeCookie = async () => {
            if (location.pathname === "/logout") return;
            try {
                console.log("User Provider is mounted...");

                const response = await backend.get("/auth/verify-session", {
                    signal
                });
                console.log(response);
                if (
                    !response.data.user ||
                    Object.keys(response.data.user).length === 0
                ) {
                    console.log("Session came back empty: ", response.data);
                    Logout();
                } else {
                    console.log(
                        "API returned successful request with data: ",
                        response.data.user
                    );
                    Login(response.data.user);
                    if (
                        response.data.user.onboarded !== undefined &&
                        !response.data?.user?.onboarded
                    ) {
                        console.log(
                            "Verify session shows that user is not onbaorded, redirecting..."
                        );
                        navigate("/setupwizard");
                    }
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("Request was aborted, ignoring error.");
                } else {
                    Logout();
                    console.log(
                        "User Provider failed to verify session, user set to null...",
                        err
                    );
                }
            } finally {
                setLoading(false);
                console.log("User loading set to false...");
            }
        };

        verifyAndDecodeCookie();
        return () => {
            controller.abort();
        };
    }, [location.pathname, navigate]);

    const providerValue = useMemo(
        () => ({
            userContext,
            loading,
            Login,
            Logout
        }),
        [userContext, loading, Login, Logout]
    );

    console.log("Returning Provider children component...");
    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
