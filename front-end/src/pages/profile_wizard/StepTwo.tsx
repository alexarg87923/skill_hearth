import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"

const skills = [
    'sewing', '2d art', '3d art', 'digital art', 'guitar', 'programming', 'carpentry', 'cooking', 'ceramics', 'songwriting', 'singing'
]

const StepTwo: React.FC = () => {

    return(
        <div className="h-screen">
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl font-bold mb-8">Add Some Skills</h1>
                    <h2 className="text-2xl font-bold mb-4">What would you like to share?</h2>
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
            </div>
        </div>
    )
}

export default StepTwo