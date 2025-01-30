import React, { useEffect } from "react"

const Settings: React.FC = () => {
	useEffect(() => {
		console.log("Settings page loaded...");
	}, []);
	return (
		<div>
            <div className=" pt-52 grid grid-cols-2">
                <div className="items-center text-center">
                    <h1 className="text-2xl">
                        Change Password
                    </h1>
                    <p className="text-sm">
                        Update your password associated with your account.
                    </p>
                </div>
                <div className="grid grid-rows-3 mx-auto items-center">
                    <input placeholder="Current Password" className="mb-5 focus-visible:outline-none py-2 rounded w-80 px-5 text-white bg-gray-800" />
                    <input placeholder="New Password" className="mb-5 focus-visible:outline-none py-2 rounded w-80 px-5 text-white bg-gray-800" />
                    <input placeholder="Confirm New Password" className="mb-5 focus-visible:outline-none py-2 w-80 rounded px-5 text-white bg-gray-800" />
                    <div>
                        <button type="submit" className="text-white rounded px-4 py-2 bg-indigo-500 hover:bg-indigo-400">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 py-32">
                <div className="grid grid-row-2 text-center">
                    <h1 className="text-2xl">Log out other sessions</h1>
                    <p className="text-sm">Please enter your password to confirm you would like</p>
                    <p className="text-sm">to log out of your other sessions across all of your devices.</p>
                </div>
                <div className="grid grid-row-2 mx-auto">
                    <input placeholder="New Password" className="mb-5 focus-visible:outline-none py-2 rounded w-80 px-5 text-white bg-gray-800" />
                    <div className="">
                        <button type="submit" className="text-white rounded px-4 py-2 bg-indigo-500 hover:bg-indigo-400">
                            Log out of other sessions
                        </button>
                    </div>
                </div>
            </div>
            <div className="py-52 grid grid-cols-2 text-center items-center">
                <div className="grid grid-rows-3">
                    <h1 className="text-2xl">Delete Account</h1>
                    <p className="text-sm">No longer want to use our service? You can delete your account here. This action is not reversible.</p>
                    <p className="text-sm">All information related to this account will be deleted permanently.</p>
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