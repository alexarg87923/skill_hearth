import React, { useEffect } from "react"

const Settings: React.FC = () => {
	useEffect(() => {
		console.log("Settings page loaded...");
	}, []);
	return (
		<div className="min-h-screen">
            <div className="grid grid-cols-2">
                <div className="items-center text-center">
                    <h1 className="text-2xl">
                        Change Password
                    </h1>
                    <p className="text-sm">
                        Update your password associated with your account.
                    </p>
                </div>
                <div>
                    <input>
                    </input>
                </div>
            </div>
            <div className="grid grid-cols-2 text-center items-center mt-64">
                <div className="py-20">
                    <h1 className="text-2xl">Delete Account</h1>
                    <p className="text-sm">No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.</p>
                </div>
                <div>
                    <button className="bg-red-700 hover:bg-red-500 rounded-sm p-2">
                        Delete Account
                    </button>
                </div>
            </div>
		</div>
	);
};
    
export default Settings;