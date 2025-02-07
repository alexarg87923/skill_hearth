import { useState, useContext, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons";
import apiAxios from "../../components/apiAxios";
import CsrfContext from '../../provider/CsrfProvider';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import UserContext from "../../provider/UserProvider";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export interface iFormData {
    stepOne: {
        bio: string,
        pic: string,
        phone: string,
        shareEmail: boolean,
        location: string
    },
    stepTwo: Array<string>,
    stepThree: Array<string>
};

const ProfileWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [cities, setCities] = useState([]);
    const { Login } = useContext(UserContext);
    const { csrfToken } = useContext(CsrfContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<iFormData>({
        stepOne: {
            bio: '',
            pic: '',
            phone: '',
            shareEmail: false,
            location: ''
        },
        stepTwo: [],
        stepThree: []
    });

    useEffect(() => {
        const fetch_and_populate_cities = async () => {
            const result = await apiAxios.get('/user/wizard');
    
            if (result.status === 200) {
                console.log(`Fetched cities: ${JSON.stringify(result.data)}`);
                setCities(result.data);
            };
        };
        fetch_and_populate_cities();
    }, []);

    const handleSubmit = async (finalFormData: iFormData) => {
        const result = await apiAxios.post('/user/wizard', 
            {
                bio: finalFormData.stepOne.bio,
                profile_picture: finalFormData.stepOne.pic,
                phone_number: finalFormData.stepOne.phone,
                share_email: finalFormData.stepOne.shareEmail,
                location: finalFormData.stepOne.location,
                skills: finalFormData.stepTwo,
                interests: finalFormData.stepThree
            },
            {
                headers: { 'CSRF-Token': csrfToken }
            }
        );

        if (result.status === 200) {
            console.log(result);
            toast.success('Successfuly created your profile!');
            if (result.data?.user) {
                Login(result.data?.user);
                navigate('/dashboard');
            };
        };
    };

    return (
        <>
            <StepTransition step={step} stepNum={1}>
                <StepOne
                    cities={cities}
                    rightArrow={<StepArrow setStep={setStep} orientation="right" />}
                    formData={formData}
                    setFormData={setFormData}
                />
            </StepTransition>

            <StepTransition step={step} stepNum={2}>
                <StepTwo
                    leftArrow={<StepArrow setStep={setStep} orientation="left" />}
                    rightArrow={<StepArrow setStep={setStep} orientation="right" />}
                    formData={formData}
                    setFormData={setFormData}
                />
            </StepTransition>

            <StepTransition step={step} stepNum={3}>
                <StepThree
                    leftArrow={<StepArrow setStep={setStep} orientation="left" />}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />
            </StepTransition>
        </>
    );
};

export default ProfileWizard;

interface StepTransitionProps {
    step: number;
    stepNum: number;
    children: React.ReactNode;
};

const StepTransition: React.FC<StepTransitionProps> = ({ step, stepNum, children }) => {
    return (
        <Transition
            show={step === stepNum}
            appear
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="relative">{children}</div>
        </Transition>
    );
};

interface ArrowProps {
    orientation: 'left' | 'right';
    setStep: React.Dispatch<React.SetStateAction<number>>;
    sendDataUp?: () => void;
};
  
const StepArrow: React.FC<ArrowProps> = ({ orientation, setStep, sendDataUp }) => {
    const handleClick = () => {
        setStep((prev) => {
        if (orientation === "right") {
            return Math.min(prev + 1, 3);
        } else {
            return Math.max(prev - 1, 1);
        }
        });

        sendDataUp?.();
    };
  
    return (
        <div className={`absolute ${orientation}-5 top-[calc(50%)]`}>
            <IconContext.Provider value={{ size: "2rem", color: "black" }}>
                <button
                    className="bg-gray-500 rounded-full p-2 text-white hover:bg-gray-600 transition"
                    onClick={handleClick}
                >
                    {orientation === "right" ? <FaArrowRight /> : <FaArrowLeft />}
                </button>
            </IconContext.Provider>
        </div>
    );
};