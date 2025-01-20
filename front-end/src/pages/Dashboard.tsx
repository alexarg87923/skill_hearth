import React from "react"

interface userProfile {
    name: string;
    skillset: string[];
    bio: string;
}
interface chatUser {
    name: string;
    lastMessage: string;
    timeStamp: string;
}

const dashboard: React.FC = () => {
    const currentUser = {
        name: "John Doe",
        skillset: ["Javascript", "React", "TypeScript"],
        bio: "I love developing web apps and live in my basement"
    };

    const suggestedProfiles: userProfile[] = [
        {
          name: "Jane Smith",
          skillset: ["Art", "Photoshop", "Dancing"],
          bio: "I love doing theater in my free time! Dance with me!.",
        },
        {
          name: "Alex Johnson",
          skillset: ["Hardware", "Repair man", "Microservices"],
          bio: "Computer engineer with a passion for building and fixing PC.",
        }
      ];
      const connectedChats: chatUser[] = [
        {
          name: "Maria Garcia",
          lastMessage: "Hey! How’s the project going?",
          timeStamp: "2:45 PM",
        },
        {
          name: "Michael Brown",
          lastMessage: "Looking forward to our next meeting.",
          timeStamp: "1:30 PM",
        },
        {
          name: "Sarah Lee",
          lastMessage: "Can you share the design file?",
          timeStamp: "12:15 PM",
        },
      ];

      return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
          {/* Left Sidebar */}
          <div className="w-1/4 bg-gray-800 p-6 shadow-md">
            {/* Profile Section */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-100 mb-4">Profile</h1>
              <h2 className="text-lg font-semibold">{currentUser.name}</h2>
              <p className="text-gray-300">{currentUser.bio}</p>
              <h3 className="text-sm font-medium text-gray-300 mt-4 mb-2">
                Skillset
              </h3>
              <ul className="list-disc ml-4 text-gray-300">
                {currentUser.skillset.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
    
            {/* Suggestions to Connect */}
            <h2 className="text-lg font-bold text-gray-100 mb-4">
              Suggestions to Connect
            </h2>
            {suggestedProfiles.map((profile, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-700 rounded-lg shadow-md"
              >
                <h3 className="text-sm font-semibold text-gray-100">{profile.name}</h3>
                <p className="text-sm text-gray-400">{profile.bio}</p>
                <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700">
                  Connect
                </button>
              </div>
            ))}
          </div>
    
          {/* Main Content */}
          <div className="flex-grow p-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-6">Chats</h1>
            <div className="bg-gray-800 shadow-md p-6 rounded-lg">
              {connectedChats.map((chat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-4 p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {chat.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{chat.timeStamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
export default dashboard;