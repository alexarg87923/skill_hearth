import React, { useEffect } from "react";

const PageNotFound: React.FC = () => {
    useEffect(() => {
        console.log("404 Page not found!");
    }, []);
    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 pt-16">
            <h1>Error, 404 not found!</h1>
        </div>
    );
};

export default PageNotFound;
