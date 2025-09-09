import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className="min-h-screen w-full p-4 flex justify-center ">
      <div
        className={`grid ${
          selectedUser ? "grid-cols-[25%_1fr_25%]" : "grid-cols-[50%_1fr]"
        } w-[80%] h-[calc(100vh-2rem)] rounded-lg bg-gray-400/10 backdrop-blur-lg border border-gray-100/20 shadow-lg`}
      >
        <div className="bg-white/5 rounded-l-lg">
          <Sidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </div>
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        {selectedUser && (
          <RightSidebar
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
