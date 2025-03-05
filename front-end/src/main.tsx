import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import "./assets/index.css";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Connect from "./pages/Connect";
import PageNotFound from "./pages/PageNotFound";
import Logout from "./pages/Logout";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";

import { UserProvider } from "./provider/UserProvider";
import ProfileWizard from "./pages/profile_wizard/ProfileWizard";

import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <UserProvider>
                <Nav />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/connect" element={<Connect />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route
                            path="/setupwizard"
                            element={<ProfileWizard />}
                        />
                    </Route>

                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
                <Footer />
                <ToastContainer />
            </UserProvider>
        </BrowserRouter>
    </StrictMode>
);
