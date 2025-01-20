import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CsrfContext from '../provider/CsrfProvider';

function Login() {
	const csrfToken = useContext(CsrfContext);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
		  const response = await axios.post('/api/auth/login', 
			formData,
			{
			  headers: {
				'CSRF-Token': csrfToken
			  }
			}
		  );
		  console.log(response);
		  if (response.status === 200) {
			navigate('/dashboard');
		  }
		} catch (error) {
		  console.error('Error signing up:', error);
		  alert(`Failed to sign up. Please try again. ${error}`);
		}
	  };

    return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="text-4xl font-bold mb-8">Login</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
				className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
				/>
				<input
				className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
				/>
				<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400 hover:text-white">
				Log in!
				</button>
			</form>
		</main>
    );
  }

  export default Login;