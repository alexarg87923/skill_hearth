"use client";

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CsrfContext from '../provider/CsrfProvider';
import UserContext from '../provider/UserProvider';

function Signup() {
	const csrfToken = useContext(CsrfContext);
	const { userContext } = useContext(UserContext);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		first_name: '',
		middle_name: '',
		last_name: '',
		email: '',
		password: '',
	});

	useEffect(() => {
		if (userContext) {
			navigate('/dashboard');
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const clearInput = () => {
		setFormData({
			first_name: '',
			middle_name: '',
			last_name: '',
			email: '',
			password: '',
		});
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post('/api/auth/signup', 
			formData,
			{
				headers: {
				'CSRF-Token': csrfToken
				}
			}
			);
			if (response.status == 200) {
			alert('Success!');
			clearInput();
			}
		} catch (error) {
			console.error('Error signing up:', error);
			alert('Failed to sign up. Please try again.');
		}
	};
  

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<h1 className="text-4xl font-bold mb-8">Sign Up</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				type="text"
				name="first_name"
				placeholder="First Name"
				value={formData.first_name}
				onChange={handleChange}
				required
			/>
			<input
				type="text"
				name="middle_name"
				placeholder="Middle Name"
				value={formData.middle_name}
				onChange={handleChange}
			/>
			<input
				type="text"
				name="last_name"
				placeholder="Last Name"
				value={formData.last_name}
				onChange={handleChange}
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				value={formData.password}
				onChange={handleChange}
				required
			/>
			<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
				Sign Up
			</button>
			</form>
		</main>
  	);
};

export default Signup;
