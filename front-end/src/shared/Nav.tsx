import React, { useContext, useState } from 'react';
import UserContext from '../provider/UserProvider';

const Nav: React.FC = () => {
	const { userContext } = useContext(UserContext);
	const [optionsOpen, setOptionsOpen] = useState(false);

	return (
		<nav className="bg-white border-gray-200 dark:bg-gray-900">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
			<a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
				<img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
				<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SkillHearth</span>
			</a>
			<button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
				<span className="sr-only">Open main menu</span>
				<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
					<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
				</svg>
			</button>
			<div className="hidden w-full md:block md:w-auto" id="navbar-default">
				<ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
					{!userContext || Object.keys(userContext).length === 0 ?
							<>
								<li>
									<a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
								</li>
								<li>
									<a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About</a>
								</li>
								<li>
									<a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
								</li>
							</>
							:
							<li>
								<a href="/dashboard" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Dashboard</a>
							</li>
						}
						{!userContext || Object.keys(userContext).length === 0 ?
							<>
								<li>
									<a href="/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
								</li>
								<li>
									<a href="/signup" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Sign up</a>
								</li> 
							</> 
							:
							<div className=' relative'>
								<button
									type="button"
									className="flex items-center space-x-2 text-gray-900 dark:text-white focus:outline-none"
									onClick={() => setOptionsOpen(!optionsOpen)}
								>
									{
										userContext?.profile_picture
										?
										<img
											src={userContext.profile_picture}
											alt={`${userContext.name}'s profile`}
											width="40"
											height="40"
										/>
										:
										<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="currentColor"
										viewBox="0 0 24 24"
										className="w-8 h-8 text-gray-600 dark:text-gray-300"
										>
										<path
											d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
										/>
										</svg>
									}
								</button>
								<div className='absolute'>
									{optionsOpen &&
										<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10">
											<ul>
												<li>
													<a
													href="/profile"
													className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
													>
													Profile
													</a>
												</li>
												<li>
													<a
													href="/settings"
													className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
													>
													Settings
													</a>
												</li>
												<li>
													<a
													href="/logout"
													className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
													>
													Logout
													</a>
												</li>
											</ul>
										</div>
									}
								</div>
							</div> 
						}
				</ul>
			</div>
			</div>
		</nav>
	);
}

export default Nav;