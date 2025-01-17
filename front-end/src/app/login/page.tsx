"use client"

import React, { useState } from 'react';
import { withProtectedPage } from '../lib/withProtectedPage';
import ProtectedPageProps from '../types/ProtectedPageProps';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function LogIn({ csrfToken }: ProtectedPageProps) {
	const router = useRouter()
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
		  if (response.status == 200) {
			alert('Success!');
			router.push('/dashboard')
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
          Log in!
        </button>
      </form>
    </main>
    );
  }

  export default withProtectedPage(LogIn, { redirectTo: '/login' });