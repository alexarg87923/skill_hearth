import React, { useEffect } from "react";

const Connect: React.FC = () => {
	useEffect(() => {
		console.log('Loaded Connect Page....');
	}, []);
	return (
		<div className="flex h-screen bg-gray-900 text-gray-200 pt-16">
			<h1>In progres...</h1>
		</div>
	);
};
    
export default Connect;