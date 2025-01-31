import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"
const skills = [
    'sewing', '2d art', '3d art', 'digital art', 'guitar', 'programming', 'carpentry', 'cooking', 'ceramics', 'songwriting', 'singing'
]
const StepTwo: React.FC = () => {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
    const toggleSelection = (skill: string) => {
      setSelectedSkills((prevSelectedSkills) =>
        prevSelectedSkills.includes(skill)
          ? prevSelectedSkills.filter((s) => s !== skill) 
          : [...prevSelectedSkills, skill] 
      );
    };
    return(
        <div className="h-screen">
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl font-bold mb-8">Add Some <span className="text-green-400">Skills</span></h1>
                    <h2 className="text-2xl font-bold mb-4">What would you like to share?</h2>
                </div>
                <div className="w-1/2">
                    <ul className="flex flex-wrap items-center justify-around">
                        {
                            skills.map((skill, index) => (
                                <li key={index}>
                                    <button
                                        className={`px-6 py-2 rounded-full m-2 my-3 ${
                                            selectedSkills.includes(skill) ? 'bg-blue-500' : 'bg-gray-700'
                                        }`}
                                        onClick={() => toggleSelection(skill)}
                                    >                    
                                        {skill}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Selected Skills:</h2>
                    <ul>
                        {selectedSkills.length > 0 ? (
                        selectedSkills.map((skill, index) => (
                            <li key={index} className="text-lg">{skill}</li>
                        ))
                    ) : (
                        <p>No skills selected</p>
                    )}
                    </ul>
                </div>
                <button 
                    className="px-8 py-2 bg-gray-700 rounded-full text-xl font-bold mt-4"
                    onClick={() => {
                        // Example of sending the selectedSkills to the backend
                        console.log("Selected skills to send to backend:", selectedSkills);
                        // You can replace the above line with an actual API call
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    )
}
export default StepTwo