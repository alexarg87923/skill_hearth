import React, { useEffect } from "react"

const Settings: React.FC = () => {
	useEffect(() => {
		console.log("Settings page loaded...");
	}, []);
	return (
		<div className="flex h-screen bg-gray-900 text-gray-200">
			<h1>Settings page</h1>
        </div>
	);
};
    
export default Settings;