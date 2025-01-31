import { useState } from "react"

const StepThree: React.FC = () => {

    const skills = [
        'sewing', '2d art', '3d art', 'digital art', 'guitar', 'programming', 'carpentry', 'cooking', 'ceramics', 'songwriting', 'singing'
    ]
    
    return (
        <div className="h-screen">
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl font-bold mb-8">Add Some <span className="text-blue-400">Interests</span></h1>
                    <h2 className="text-2xl font-bold mb-4">What would you like to learn?</h2>
                </div>
                <div className="w-1/2">
                    <ul className="flex flex-wrap items-center justify-around">
                        {
                            skills.map((skill, index) => (
                                <li key={index}>
                                    <button className="bg-gray-700 px-6 py-2 rounded-full m-2 my-3">
                                        {skill}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <button className="my-12 px-8 p-1 border-b-4 border-blue-400 text-xl font-bold transition-colors hover:text-green-400">Onboard!</button>
            </div>
        </div>
    )
}

export default StepThree