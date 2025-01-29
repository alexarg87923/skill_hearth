import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CsrfContext from '../provider/CsrfProvider';
import UserContext from '../provider/UserProvider';
import { toast } from 'react-toastify';

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
        confirm_password: ''
	});

	useEffect(() => {
		console.log('Sign up page loaded...');
		if (userContext) {
			console.log('User is being redirected to dashboard...');
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
            confirm_password: ''
		});
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
            if (formData.password != formData.confirm_password) {
                
            }

			const response = await axios.post('/api/auth/signup', 
			formData,
			{
				headers: {
				'CSRF-Token': csrfToken
				}
			}
			);
			if (response.status == 201) {
			    toast.success('Successfuly registed your account!');
			    clearInput();
                navigate('/login');
			}
		} catch (error) {
			toast.error('There was an error creating your account.');
			console.log(error);
		}
	};
  

	return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label>First name*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <label>Middle name</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="text"
                    name="middle_name"
                    placeholder="Middle Name"
                    value={formData.middle_name}
                    onChange={handleChange}
                />
                <label>Last name*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                <label>Email*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
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
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
                <label className="text-red-700">Passwords do not match!</label>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Sign Up
                </button>
            </form>
        </main>
  	);
};

export default Signup;
