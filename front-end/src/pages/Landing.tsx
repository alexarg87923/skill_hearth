function Landing() {
	return (
		<>
			<main className="flex min-h-screen flex-col items-center justify-top p-12 mt-8">
				<h1 className="text-5xl font-serif mb-4 text-center text-gray-800 dark:text-white">Welcome to Skill Hearth</h1>
				<section className="bg-gray-100 dark:bg-black py-12 px-6 mt-12 w-full">
					<div className="max-w-screen-xl mx-auto text-center">
						<h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Empower Your Skills</h2>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							Unlock your potential with our comprehensive learning platform. Whether you're starting fresh or advancing your career, Skill Hearth provides the tools you need to succeed.
						</p>
						<div className="flex justify-center space-x-4">
							<a href="/#" className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg">
								Learn More
							</a>
							<a href="/#" className="bg-blue-600 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg">
								Get Started
							</a>
						</div>
					</div>
				</section>
			</main>
		</>
  )
}

export default Landing
