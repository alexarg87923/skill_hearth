import { useEffect } from "react";

function Landing() {
    useEffect(() => {
        console.log("Loaded dashboard page...");
    }, []);

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black">
                <h1
                    className="text-6xl mb-8 text-center text-white font-bold"
                    style={{ fontFamily: "Merriweather, serif" }}
                >
                    Welcome to Skill Hearth
                </h1>
                <section className="bg-gradient-to-r from-blue-700 via-cyan-700 to-black-700 py-12 px-6 mt-12 w-full rounded-lg shadow-lg">
                    <div className="max-w-screen-xl mx-auto text-center">
                        <h2
                            className="text-4xl font-bold text-white mb-4"
                            style={{ fontFamily: "Playfair Display, serif" }}
                        >
                            Empower Your Skills
                        </h2>
                        <p
                            className="text-white mb-8"
                            style={{ fontFamily: "Roboto, sans-serif" }}
                        >
                            Unlock your potential with our comprehensive
                            learning platform. Whether you're starting fresh or
                            advancing your career, Skill Hearth provides the
                            tools you need to succeed.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <a
                                href="/#"
                                className="bg-teal-600 hover:bg-teal-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Sign up
                            </a>
                            <a
                                href="/#"
                                className="bg-cyan-600 hover:bg-black-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Landing;
