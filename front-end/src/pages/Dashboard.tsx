import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../provider/UserProvider";
import { BiSolidSend } from "react-icons/bi";

interface IMessage {
    name: string;
    message: string;
}

interface chatUser {
    name: string;
    lastMessage?: string;
    timeStamp: string;
    history: Array<IMessage>;
}

const dashboard: React.FC = () => {
    const { userContext } = useContext(UserContext);
    // const [hideEmailVer, setHideEmailVer] = useState(false);
    const [selectedIndexChat, setSelectedIndexChat] = useState(0);
    const chatHistoryRef = useRef<HTMLDivElement | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        console.log("Loaded dashboard page...");
        
        ws.current = new WebSocket("ws://localhost:3000/api/ws/chat");

        ws.current.onopen = () => {
            console.log("ws opened");
            if (ws.current !== null) {
                ws.current.send("test");
            };
        };

        ws.current.onclose = () => console.log("ws closed");

        return () => {
            if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
                ws.current.close();
            }
        };

        // };

        // if (chatHistoryRef.current) {
        //     chatHistoryRef.current.innerHTML = connectedChats[
        //         selectedIndexChat
        //     ].history
        //         ?.map((chat, index) => {
        //             return `
        //         ${
        //             chat.name === "You"
        //                 ? `<div class="mt-5 flex flex-col items-end" key="${index}">
        //                 <div class="text-gray-500 text-sm pr-2">
        //                     ${chat.name}
        //                 </div>
        //                 <div class="bg-gray-200 text-gray-600 rounded-lg p-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg inline-block">
        //                     ${chat.message ? chat.message : "Unknown sender"}
        //                 </div>
        //             </div>`
        //                 : `<div class="mt-5 flex flex-col items-start" key="${index}">
        //                 <div class="text-gray-500 text-sm pl-2">
        //                     ${chat.name}
        //                 </div>
        //                 <div class="bg-blue-600 text-white rounded-lg p-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg inline-block">
        //                     ${chat.message ? chat.message : "Unknown sender"}
        //                 </div>
        //             </div>`
        //         }`;
        //         })
        //         .join("");
        // }
    }, [selectedIndexChat]);

    const currentUser = {
        name: userContext?.name || ""
        // skillset: userContext?.skillset || [],
        // bio: userContext?.bio || ''
    };

    const connectedChats: chatUser[] = [
        {
            name: "Maria Garcia",
            timeStamp: "2:45 PM",
            history: [
                { name: "You", message: "hey" },
                { name: "Maria", message: "hi" },
                { name: "You", message: "hows the project going" },
                {
                    name: "Maria",
                    message: "good good ive been stuck on this one bug"
                },
                { name: "You", message: "oh really can i take a look" }
            ]
        },
        {
            name: "Michael Brown",
            lastMessage: "Looking forward to our next meeting.",
            timeStamp: "1:30 PM",
            history: []
        },
        {
            name: "Sarah Lee",
            lastMessage: "Can you share the design file?",
            timeStamp: "12:15 PM",
            history: []
        }
    ];

    const selectChat = (index: number) => {
        alert(`Selected ${index}th chat!`);
        setSelectedIndexChat(index);
    };

    //   const clipPathValue = "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)";

    //   const divStyle = {
    // 	clipPath: clipPathValue,
    //   };

    return (
        <>
            {/* <div className={`relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 ${hideEmailVer ? 'hidden' : ''}`}>
				<div className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
					<div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style={divStyle}></div>
				</div>
				<div className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
					<div className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style={divStyle}></div>
				</div>
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
					<p className="text-sm/6 text-gray-900">
					<strong className="font-semibold">Attention</strong><svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>We noticed you have not verified your email yet
					</p>
					<a href="#" className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">Send email<span aria-hidden="true">&rarr;</span></a>
				</div>
				<div className="flex flex-1 justify-end">
					<button type="button" onClick={() => setHideEmailVer(true)} className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
					<span className="sr-only">Dismiss</span>
					<svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
						<path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
					</svg>
					</button>
				</div>
			</div> */}

            <div className="flex h-screen bg-gray-900 text-gray-200 pt-16 mb-36">
                {/* Left Sidebar */}
                <div className="w-1/4 bg-gray-800 p-6 shadow-md">
                    {/* Profile Section */}
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-100 mb-4">
                            Profile
                        </h1>
                        <h2 className="text-lg font-semibold">
                            {currentUser.name}
                        </h2>
                        {/* <p className="text-gray-300">{currentUser.bio}</p> */}
                        <h3 className="text-sm font-medium text-gray-300 mt-4 mb-2">
                            Skillset
                        </h3>
                        {/* <ul className="list-disc ml-4 text-gray-300">
					{currentUser.skillset.map((skill, index) => (
					<li key={index}>{skill}</li>
					))}
				</ul> */}
                    </div>

                    {/* Suggestions to Connect */}
                    <h2 className="text-lg font-bold text-gray-100 mb-4">
                        Chats
                    </h2>
                    {connectedChats.map((chat, index) => (
                        <div
                            key={index}
                            onClick={() => selectChat(index)}
                            className={`flex items-center justify-between mb-4 p-4 rounded-lg hover:cursor-pointer ${index === selectedIndexChat ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100">
                                    {chat.name}
                                </h3>
                                <p
                                    className={`text-sm truncate ${index === selectedIndexChat ? "text-gray-100" : "text-gray-500"}`}
                                >
                                    {chat.lastMessage
                                        ? chat.lastMessage
                                        : chat?.history[
                                                chat?.history?.length - 1 !==
                                                undefined
                                                    ? chat?.history?.length - 1
                                                    : 0
                                            ].message
                                          ? chat?.history[
                                                chat?.history?.length - 1
                                            ].message
                                          : ""}
                                </p>
                            </div>
                            <span
                                className={`text-sm ${index === selectedIndexChat ? "text-gray-100" : "text-gray-500"} `}
                            >
                                {chat.timeStamp}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-grow p-6">
                    <h1 className="text-2xl font-bold text-gray-100 mb-6">
                        Chats
                    </h1>
                    <div className="bg-gray-800 shadow-md p-6 rounded-lg">
                        <div ref={chatHistoryRef}></div>
                        <div className="flex justify-end">
                            <input className="py-3 mt-6 px-5 w-full bg-gray-600 focus-visible:outline-none"></input>
                            <button className=" ms-4 mt-6 text-4xl text-blue-600">
                                <BiSolidSend />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default dashboard;
