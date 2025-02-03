import React, { useContext, useState } from "react";
import UserContext from "../../provider/UserProvider";
import { iFormData } from "./ProfileWizard";

const StepOne: React.FC<Props> = ({ rightArrow, formData, setFormData }) => {

    const testCities = ['sunrise', 'miami', 'weston', 'boca raton', 'gainesville', 'boston', 'new york city']

    const {userContext} = useContext(UserContext)
    const [input, setInput] = useState({
        bio: formData.stepOne.bio ? formData.stepOne.bio : '',
        pic: formData.stepOne.pic ? formData.stepOne.pic : '',
        phone: formData.stepOne.phone ? formData.stepOne.phone : '',
        shareEmail: formData.stepOne.shareEmail ? formData.stepOne.shareEmail : false,
        location: formData.stepOne.location ? formData.stepOne.location : ''
    });

    const handleChange = (e: any) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    const handleNextPage = () => {
        setFormData({...formData, stepOne: input});
    };

    const Dropdown = () => {
        return(
            <div className="my-2">
                <label className="font-normal">
                    Select A Location
                    <select value={input.location} 
                        onChange={e=> setInput({...input, location: e.target.value})} 
                        className="text-black mx-4 rounded-xl px-2 py-2 border-b-4 border-blue-400"
                    >
                    {
                        testCities.map((city, index) => 
                            <option value={city} key={index} className="text-black">
                                {city}
                            </option>
                        )
                    }
                    </select>
                </label>
            </div>
        );
    };

    return(
        <div className="min-h-screen flex pt-16">
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src='https://images.unsplash.com/photo-1523745962530-340c0eeb7e7d?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='' className=""/>
            </div>
            <div className="w-1/2 mx-auto my-auto p-8 px-20">
            {React.cloneElement(rightArrow, { changeFunc: handleNextPage })}
                <h1 className="text-4xl mb-4 font-bold">Welcome {userContext ? userContext.name : ''}, Let's Get Acquainted!</h1>
                <h2 className="text-2xl mb-8">Fill out some details about yourself.</h2>

                <form>
                    <div className="mb-8">
                        <label className="text-base font-bold">
                            Bio
                            <p className="text-base font-normal mb-2 text-gray-400">Tell us a little about yourself.</p>
                            <textarea
                                placeholder="Write a thought..."
                                rows={4}
                                name='bio'
                                value={input.bio}
                                onChange={handleChange}
                                className="rounded-2xl text-base font-normal text-black px-3 py-2 w-3/4 border-b-4 border-blue-400"
                            />
                        </label>
                    </div>

                    <div className="mb-8">
                        <label className="font-bold">Profile Picture
                            <p className="font-normal text-gray-400 mb-2">Smile!</p>
                            <input
                                placeholder=""
                                type="file"
                                value={input.pic}
                                onChange={handleChange}
                                className="text-black bg-white rounded-lg"
                            />
                        </label>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-6 mt-14 ">Contact Information</h3>

                        <div className="flex gap-20">
                            <div className="mb-7">
                                <label className="text-base font-bold">Phone Number
                                    <input
                                    type="text"
                                    name='phone'
                                    value={input.phone}
                                    onChange={handleChange}
                                    className="block font-normal my-2 text-black rounded-lg px-4 py-1 border-b-4 border-blue-400"
                                    />
                                </label>
                            </div>

                            <div className="">
                                <label className="font-bold">Location
                                    <Dropdown />
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="font-bold flex items-center mb-1">Share Email?
                                <input
                                name='share-email'
                                type='checkbox'
                                checked={input.shareEmail}
                                onChange={() => setInput((prev) => ({ ...prev, shareEmail: !prev.shareEmail }))}
                                className="text-black size-5 mx-4"
                                />
                            </label>
                            <p className="font-normal text-gray-400">If checked, your email will be visible to other users.</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StepOne;

interface Props {
    rightArrow: any;
    formData: iFormData;
    setFormData: React.Dispatch<React.SetStateAction<iFormData>>;
};