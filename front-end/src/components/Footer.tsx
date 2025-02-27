import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-800 py-8">
            <div className="container mx-auto text-center text-white">
                <div className="flex justify-center space-x-8 mb-4">
                    <a
                        href="/about"
                        className="text-gray-400 hover:text-white transition duration-300"
                    >
                        About Us
                    </a>
                    <a
                        href="/services"
                        className="text-gray-400 hover:text-white transition duration-300"
                    >
                        Services
                    </a>
                    <a
                        href="/contact"
                        className="text-gray-400 hover:text-white transition duration-300"
                    >
                        Contact
                    </a>
                    <a
                        href="/privacy"
                        className="text-gray-400 hover:text-white transition duration-300"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/terms"
                        className="text-gray-400 hover:text-white transition duration-300"
                    >
                        Terms of Service
                    </a>
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                    <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition duration-300"
                        aria-label="Twitter"
                    >
                        <i className="fab fa-twitter"></i>
                    </Link>
                    <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition duration-300"
                        aria-label="LinkedIn"
                    >
                        <i className="fab fa-linkedin-in"></i>
                    </Link>
                    <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition duration-300"
                        aria-label="Instagram"
                    >
                        <i className="fab fa-instagram"></i>
                    </Link>
                    <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition duration-300"
                        aria-label="Facebook"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </Link>
                </div>
                <div className="mb-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Your Company. All
                        rights reserved.
                    </p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">
                        Contact us:{" "}
                        <a
                            href="mailto:info@yourcompany.com"
                            className="text-gray-400 hover:text-white transition duration-300"
                        >
                            info@yourcompany.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
