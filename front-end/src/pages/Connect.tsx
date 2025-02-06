import React, { useEffect, useState } from "react";

interface IProfile {
    name: string;
    profile_picture: string;
    bio: string;
    interests: Array<string>;
    skills: Array<string>;
};

const Connect: React.FC = () => {
    const [recommendedUsers, setRecommendedUsers] = useState<Array<IProfile>>([]);

	useEffect(() => {
		console.log('Loaded Connect Page....');

        setRecommendedUsers([{
            name: 'Alex Arguelles',
            profile_picture: '/api/profile_picture.jpeg',
            bio: 'Im a gamer that likes to endulge in the development of software',
            interests: ['chess', 'drawing'],
            skills: ['front-end design', 'back-end development', 'valorant', 'league']  
        },
        {
            name: 'Roseline',
            profile_picture: '/api/profile_picture.jpeg',
            bio: 'pokemon is my favorite game!!',
            interests: ['elden ring'],
            skills: ['backflips', 'pokemon']
        },
        {
            name: 'Mauricio',
            profile_picture: '/api/profile_picture.jpeg',
            bio: 'i enjoy reading!!',
            interests: ['statistics'],
            skills: ['note taking']
        }]);
	}, []);
	return (
		<div className="h-screen flex justify-center bg-gray-900 text-gray-200 pt-16 items-center">
            <div className=''>
                <div className='grid grid-cols-3 gap-6'>
                {recommendedUsers.map((profile, index) => (
                    <div className='items-center bg-gray-700 rounded-md transition ease-in hover:scale-105 flex-col' key={index}>
                        <div className='text-center p-20'>
                            <img 
                                className=" place-self-center"
                                src={profile.profile_picture}
                                alt={`${profile.name}'s profile picture`}
                                width='80'
                                height='80'
                            />
                            <p className='text-3xl'>{profile.name}</p>
                            <p>{profile.bio}</p>

                            <div className="mt-4">
                                <p className="text-xl mb-2">Interests:</p>
                                <div className='flex flex-wrap gap-2' key={index}>
                                    {profile.interests.map((interest, index) => (        
                                        <span key={index} className='bg-blue-500 rounded-md p-1'>{interest}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-xl mb-2">Skills:</p>
                                <div className='flex flex-wrap gap-2' key={index}>
                                    {profile.skills.map((skill, index) => (        
                                        <span key={index} className='bg-orange-500 rounded-md p-1'>{skill}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-between mt-10">
                                <button className="ms-10 bg-red-600 hover:bg-red-500 rouanded-sm p-1">
                                    Not Interested
                                </button>

                                <button className="me-10 bg-green-600 hover:bg-green-500 rounded-sm p-1">
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