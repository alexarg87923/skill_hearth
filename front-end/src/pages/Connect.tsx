import React, { useEffect, useState } from "react";
import backend from "../components/backend";

interface IProfile {
    name: string;
    profile_picture: string;
    bio: string;
    interests: Array<string>;
    skills: Array<string>;
}

const Connect: React.FC = () => {
    const [recommendedUsers, setRecommendedUsers] = useState<Array<IProfile>>(
        []
    );

    useEffect(() => {
        console.log("Loaded Connect Page....");

        const fetchBatch = async () => {
            const response = await backend.get("/user/connect");
            console.log(response);
        };
        fetchBatch();

        // setRecommendedUsers([
        //     {
        //         name: "Alex Arguelles",
        //         profile_picture: "/api/profile_picture.jpeg",
        //         bio: "Im a gamer that likes to endulge in the development of software",
        //         interests: ["chess", "drawing"],
        //         skills: [
        //             "front-end design",
        //             "back-end development",
        //             "valorant",
        //             "league"
        //         ]
        //     },
        //     {
        //         name: "Roseline",
        //         profile_picture: "/api/profile_picture.jpeg",
        //         bio: "pokemon is my favorite game!!",
        //         interests: ["elden ring"],
        //         skills: ["backflips", "pokemon"]
        //     },
        //     {
        //         name: "Mauricio",
        //         profile_picture: "/api/profile_picture.jpeg",
        //         bio: "i enjoy reading!!",
        //         interests: ["statistics"],
        //         skills: ["note taking"]
        //     }
        // ]);
    }, []);
    return (
        <div className="h-screen flex justify-center bg-gray-900 text-gray-100 pt-16 items-center p-4">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedUsers.map((profile, index) => (
                        <div
                            className="group items-center bg-gray-800 rounded-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:ring-2 hover:ring-gray-600 flex-col shadow-lg"
                            key={index}
                        >
                            <div className="text-center px-8 py-6 flex flex-col justify-between h-full space-y-6">
                                <div className="space-y-4">
                                    <img
                                        className="mx-auto rounded-full border-4 border-gray-700 w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                                        src={profile.profile_picture}
                                        alt={`${profile.name}'s profile picture`}
                                        width="96"
                                        height="96"
                                    />
                                    <p className="text-3xl">{profile.name}</p>
                                    <p className="text-xl">{profile.bio}</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl mb-2">Interests:</p>
                                    <div className="flex gap-2" key={index}>
                                        {profile.interests.map(
                                            (interest, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-500 rounded-md text-xl p-1"
                                                >
                                                    {interest}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-3xl mb-2">Skills:</p>
                                    <div
                                        className="flex flex-wrap gap-2"
                                        key={index}
                                    >
                                        {profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-orange-500 rounded-md text-xl p-1"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between mt-10">
                                    <button className="ms-10 bg-red-600 hover:bg-red-500 text-xl rouanded-sm p-1">
                                        Not Interested
                                    </button>

                                    <button className="me-10 bg-green-600 hover:bg-green-500 text-xl rounded-sm p-1">
                                        Interested
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Connect;
