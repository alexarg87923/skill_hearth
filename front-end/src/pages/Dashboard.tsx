import React, { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../provider/UserProvider";
import { BiSolidSend } from "react-icons/bi";
import backend from "../components/backend";

interface IChat {
    to: string;
    from: string;
    message: string;
    timeStamp: string;
}

const dashboard: React.FC = () => {
    const { userContext } = useContext(UserContext);
    // const [hideEmailVer, setHideEmailVer] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(String);
    const [chatList, setChatList] = useState<Record<string, {name: string, lastMessage: string, chats: IChat[], lastMessageTimeStamp: string}>>({});
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        console.log("Loaded dashboard page...");

        const fetch_message_list_and_populate = async () => {
            const response = await backend.get("/api/dashboard");
            if (response.status === 200 && Array.isArray(response.data.messageList) && response.data.messageList.length >= 0) {
                setChatList(response.data.messageList);
            };
        };

        fetch_message_list_and_populate();
        
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

    }, []);

    const selectChat = (uuid: string) => {
        alert(`Selected ${uuid} chat!`);
        setSelectedUserId(uuid);
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
                            {userContext ? userContext.name : ""}
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
                    <h2 className="text-lg font-bold text-gray-100 mb-4">
                        Chats
                    </h2>
                    {chatList ? Object.keys(chatList).map((uuid) => (
                        <div
                            key={uuid}
                            onClick={() => selectChat(uuid)}
                            className={`flex items-center justify-between mb-4 p-4 rounded-lg hover:cursor-pointer ${uuid === selectedUserId ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-100">
                                    {chatList[uuid].name}
                                </h3>
                                <p
                                    className={`text-sm truncate ${uuid === selectedUserId ? "text-gray-100" : "text-gray-500"}`}
                                >
                                    {chatList[uuid].lastMessage
                                        ? chatList[uuid].lastMessage
                                        : ""}
                                </p>
                            </div>
                            <span
                                className={`text-sm ${uuid === selectedUserId ? "text-gray-100" : "text-gray-500"} `}
                            >
                                {chatList[uuid].lastMessageTimeStamp}
                            </span>
                        </div>
                    )) : null}
                </div>

                {/* Main Content */}
                <div className="flex-grow p-6">
                    <h1 className="text-2xl font-bold text-gray-100 mb-6">
                        Chats
                    </h1>
                    <div className="bg-gray-800 shadow-md p-6 rounded-lg">
                        <div>
                        {selectedUserId ? chatList[selectedUserId].chats.map((chat, index) => {
                            return <div className={`mt-5 flex flex-col ${chat.from === "You" ? "items-end" : "items-start"}`} key={index}>
                                <div className={`text-gray-500 text-sm ${chat.from === "You" ? "pr-2" : "pl-2"}`}>
                                    ${chat.from}
                                </div>
                                <div className={`${chat.from === "You" ? "bg-blue-600 text-gray-600" : "bg-gray-200 text-white"}  rounded-lg p-3 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg inline-block`}>
                                    ${chat.message ? chat.message : "Unknown sender"}
                                </div>
                            </div>
                        })
                        : 
                        null
                        }
                        </div>
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
