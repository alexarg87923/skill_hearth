import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CsrfContext from '../provider/CsrfProvider';
import UserContext from '../provider/UserProvider';
import { toast } from 'react-toastify';
import apiAxios from '../components/backend';

function Signup() {
	const { csrfToken } = useContext(CsrfContext);
	const { userContext } = useContext(UserContext);
	const navigate = useNavigate();
    const [doPassMatch, setDoPassMatch] = useState(true);
    const [formEmpty, setFormEmpty] = useState(true);
	const [formData, setFormData] = useState({
		first_name: '',
		middle_name: '',
		last_name: '',
		email: '',
		password: '',
        confirm_password: ''
	});
    const [passContents, setPassContents] = useState({
        lCase: false,
        cCase: false,
        symbol: false,
        num: false
    });
    
	useEffect(() => {
		console.log('Sign up page loaded...');
		if (userContext) {
            console.log('User is being redirected to dashboard...');
			navigate('/dashboard');
		};
	}, []);
    
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name !== 'middle_name' && e.target.value === '') {
            setFormEmpty(true);
        } else {
            setFormEmpty(false);
        }

        if (e.target.name === "password") {
            const { value } = e.target;
            var tmp = {
                cCase: false,
                num: false,
                lCase: false,
                symbol: false
            };
            for (let i = 0; i < value.length; i++) {
                const code = value.charCodeAt(i);
                if (code >= 65 && code <= 90) tmp.cCase = true;
                else if (code >= 48 && code <= 57) tmp.num = true;
                else if (code >= 97 && code <= 122) tmp.lCase = true;
                else tmp.symbol = true;
            };
            setPassContents(tmp);
        };
        
        if (formData.confirm_password) {
            if (e.target.name === 'confirm_password') {
                setDoPassMatch(e.target.value === formData.password);
            };
            if (e.target.name === 'password') {
                setDoPassMatch(e.target.value === formData.confirm_password);
            }
        };

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
            if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirm_password) {
                toast.error('Missing fields...');
                return;
            }

            if (formData.password !== formData.confirm_password) {
                toast.error('Passwords do not match!');
                return;
            }

			const response = await apiAxios.post('/auth/signup', 
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
                <ul className={`mb-4 ${formData.password.length >= 9 && passContents.cCase && passContents.lCase && passContents.num && passContents.symbol ? 'hidden' : ''}`}>
                    <li><label>Password requires: </label></li>
                    <li className='ms-5'><label className={`${formData.password.length >= 9 ? 'text-green-500' : 'text-red-700'}`}>9 Size</label></li>
                    <li className='ms-5'><label className={`${passContents.cCase ? 'text-green-500' : 'text-red-700'}`}>1 Capital Letter</label></li>
                    <li className='ms-5'><label className={`${passContents.lCase ? 'text-green-500' : 'text-red-700'}`}>1 Lowercase Letter</label></li>
                    <li className='ms-5'><label className={`${passContents.num ? 'text-green-500' : 'text-red-700'}`}>1 Number</label></li>
                    <li className='ms-5'><label className={`${passContents.symbol ? 'text-green-500' : 'text-red-700'}`}>1 Symbol !@#$%^&*(),.?&lt;&gt;[]{}=-~`/</label></li>
                </ul>
                <label>Confirm Password*</label>
                <input
                    className="text-white rounded-sm bg-gray-800 focus-visible:outline-none h-10 min-w-80 p-4"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
                <label className={`text-red-700 ${doPassMatch ? 'hidden' : ''}`}>Passwords do not match!</label>
                <button disabled={
                    !((formData.password.length >= 9 && passContents.cCase && passContents.lCase && passContents.num && passContents.symbol) && 
                    ((!doPassMatch || formEmpty) || 
                    (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirm_password)))} type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Sign Up
                </button>
            </form>
        </main>
  	);
};

export default Signup;
