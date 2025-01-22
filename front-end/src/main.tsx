import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import Logout from './pages/Logout';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

import Nav from './shared/Nav';
import ProtectedRoute from './shared/ProtectedRoute';
import AuthProtectedRoute from './shared/AuthProtectedRoute';

import { CsrfProvider } from './provider/CsrfProvider';
import { UserProvider } from './provider/UserProvider';
import Footer from './shared/Footer';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<BrowserRouter>
		<CsrfProvider>
			<UserProvider>
				<Nav />
				<Routes>
					<Route path="/" element={<Landing />} />

					<Route element={<AuthProtectedRoute />}>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
					</Route>

					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/profile" element={<Profile />} />
					</Route>

					<Route path="/logout" element={<Logout />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
				<Footer />
			</UserProvider>
		</CsrfProvider>
    </BrowserRouter>
  </StrictMode>
)
