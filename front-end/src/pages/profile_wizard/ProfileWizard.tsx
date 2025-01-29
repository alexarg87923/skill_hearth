import { useContext, useState } from "react"
import UserContext from "../../provider/UserProvider"
import StepOne from "./StepOne"
import StepTwo from "./StepTwo"

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

    return(
        <div>
            <StepOne />
        </div>
    )
}

export default ProfileWizard