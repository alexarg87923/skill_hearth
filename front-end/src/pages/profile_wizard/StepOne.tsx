import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"

const StepOne: React.FC = () => {
    const {userContext} = useContext(UserContext)
    const [input, setInput] = useState({
        bio: '',
        pic: '',
        phone: '',
        shareEmail: false,
        location: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
    }

    return(
        <div className="h-screen flex">
            <div className="w-1/2">
                <img src='https://d2fl3xywvvllvq.cloudfront.net/wp-content/uploads/2016/04/benefitsofcollaboration.jpg' alt='' className="object-cover"/>
            </div>
            <div className="w-1/2 mx-auto my-auto p-8">
                <h1 className="text-4xl mb-4">Welcome {userContext ? userContext.name : ''}, Let's Get Acquainted!</h1>
                <h2 className="text-2xl mb-8">Fill out some details about yourself.</h2>

                <form>
                    <div className="mb-8">
                        <label>Bio</label>
                        <p className="">Tell us a little about yourself.</p>
                        <input
                        placeholder=""
                        type='text'
                        value={input.bio}
                        onChange={handleChange}
                        className="rounded-2xl"
                        />
                    </div>

                    <div className="mb-8">
                        <label>Profile Picture</label>
                        <p>Smile!</p>
                        <input
                        placeholder=""
                        type="file"
                        value={input.bio}
                        onChange={handleChange}
                        className=""
                        />
                    </div>

                    <div className="mb-8">
                        <h3>Contact Information:</h3>

                        <div className="mb-4">
                            <label className="">Phone Number</label>
                            <input
                            placeholder=""
                            type="text"
                            value={input.phone}
                            onChange={handleChange}
                            className="mx-2"
                            />
                        </div>

                        <div className="mb-4">
                            <label>Share Email?</label>
                            <p>If checked, your email will be visible to other users.</p>
                            <input
                            placeholder=""
                            type="text"
                            onChange={handleChange}
                            className=""
                            />
                        </div>
                    </div>
                    <button className="px-8 py-2 bg-gray-700 rounded-full text-xl font-bold">Next</button>
                </form>
            </div>
        </div>
    )
}

export default StepOne