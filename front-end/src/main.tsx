import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';

// definig more elegant way to import files (look ./pages/index.ts)
import { Landing, Login, Signup, Dashboard, PageNotFound, Logout, Settings, Profile } from './pages';

import Nav from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';

import { CsrfProvider } from './provider/CsrfProvider';
import { UserProvider } from './provider/UserProvider';
import Footer from './components/Footer';



createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<CsrfProvider>
				<UserProvider>
					<Nav />
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />

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
