import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"
import StepOne from "./StepOne"
import StepTwo from "./StepTwo"
import StepThree from "./StepThree"
import { Transition } from "@headlessui/react"
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons"

const ProfileWizard: React.FC = () => {

    /* 

        Form layout
        Bio - text, no placeholder, large, screen width text space
        pic - upload, no placeholder, large, screen width prompt
        contact: one line
        phone - text, no placeholder
        shareemail - checkbox, w/ disclaimer text, default unchecked
        location (city) - text, no placeholder
        next button
    */

    /* 
        Flow:
            -state variable for step #
            -hide step and show next as user progresses
            -save progress and keep track of inputs per step
                -if they timeout/logout after completing a step, start them off on the next incomplete step
            -validate form inputs before moving on to next step, update profile if valid
    */

    //console.log('from setupwizard: ' + userContext)

    const[step, setStep] = useState(1)
    const [inputs, setInputs] = useState({
        bio: '',
        pic: '',
        phone: '',
        shareEmail: false,
        location: '',
    })

    const handleNext = () => {
        setStep(step+1)
    }

    const handlePrev = () => {
        setStep(step-1)
    }

    const ArrowButton = ({changeFunc, icon}: any) => {
        return(
            <IconContext.Provider value={{size: '4rem', color: 'black'}}>
                <div className="bg-gray-500 rounded-full w-fit p-1 py-2">
                    <button onClick={changeFunc}>
                        {icon}
                    </button>
                </div>
            </IconContext.Provider>
        )
    }

    const TransitionContainer = ({stepNum, children}: any) => {
        return(
            <Transition show={step == stepNum || stepNum == 'none' ? true : false} appear={true}>
                <div className="transition duration-300 ease-in data-[closed]:opacity-0">
                    {children}
                </div>
            </Transition>
        )
    }

    return(
        <div>
            {
                <div>
                    {
                        step <= 2 ?
                        (                            
                            <div className="absolute right-5 top-[calc(50%)]">
                                <ArrowButton changeFunc={handleNext} icon={<FaArrowRight />} />
                            </div>                        
                        ) : null
                    }

                    {
                        step >= 2 ?
                        (
                            <div className="absolute left-5 top-[calc(50%)]">
                                <ArrowButton changeFunc={handlePrev} icon={<FaArrowLeft/>} />
                            </div>
                        ) : null
                    }

                    <TransitionContainer stepNum={1}>
                        <StepOne />
                    </TransitionContainer>
                    <TransitionContainer stepNum={2}>
                        <StepTwo />
                    </TransitionContainer>
                    <TransitionContainer stepNum={3}>
                        <StepThree />
                    </TransitionContainer>
                </div>
            }


        </div>
    )
}

export default ProfileWizard