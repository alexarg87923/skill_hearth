import React, { useEffect } from "react"

const Settings: React.FC = () => {
	useEffect(() => {
		console.log("Settings page loaded...");
	}, []);
	return (
		<div>
			<form>
                <div className="grid grid-cols-2">
                    <h1 className="text-center items-center">Delete Account</h1>
                    <p>No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.</p>
                </div>
			</form>
		</div>
	);
};
    
export default Settings;