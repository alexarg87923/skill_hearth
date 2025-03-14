import React, { useContext, useEffect, useState } from "react";
import backend from "../components/backend";
import { useNavigate } from "react-router-dom";
import UserContext from "../provider/UserProvider";
import { toast } from "react-toastify";

function Login() {
    const { Login, userContext } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        console.log("Loaded login page...");
        if (userContext) {
            console.log(
                "Redirecting user to dashboard due to being logged in..."
            );
            navigate("/dashboard");
        }
    }, [navigate, userContext]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await backend.post("/auth/login", formData);

            if (response.status === 200) {
                console.log(response.data);
                Login(response.data.user);
                if (!response?.data?.user?.onboarded) {
                    navigate("/setupwizard");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("There was an error logging in.");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Login</h1>
            <form
                onSubmit={handleSubmit}
                method="POST"
                className="flex flex-col gap-4"
            >
                <label>Email*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 hover:text-white"
                >
                    Log in!
                </button>
            </form>
        </main>
    );
}

export default Login;
