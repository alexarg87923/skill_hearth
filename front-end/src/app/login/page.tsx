"use client"

import { withProtectedPage } from '../lib/withProtectedPage';
import ProtectedPageProps from '../types/ProtectedPageProps';
import axios from 'axios';

function LogIn({ csrfToken }: ProtectedPageProps) {
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
		  const response = await axios.post('/api/auth/login', 
			// formdata goes in here too
			{
			  headers: {
				'X-CSRF-Token': csrfToken
			  },
			}
		  );
		} catch (error) {
		  console.error('Error signing up:', error);
		  alert('Failed to sign up. Please try again.');
		}
	  };

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Log In</h1>
        <p>Login form coming soon!</p>
      </main>
    );
  }

  export default withProtectedPage(LogIn, { redirectTo: '/login' });