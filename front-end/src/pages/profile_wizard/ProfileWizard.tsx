import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"

const ProfileWizard: React.FC = () => {
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

    console.log('from setupwizard: ' + userContext)

    return(
        <div>
            <div className="w-1/2">


            </div>
            <div className="w-1/2">
                <h1>Welcome {userContext ? userContext.name : ''}, Let's Get Acquainted!</h1>
                <h2>Fill out some details about yourself.</h2>

                <form>
                    

                </form>
            </div>
        </div>
    )
}

export default ProfileWizard