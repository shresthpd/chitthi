import React, { useContext, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext.jsx";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  return (
    <div className="min-h-screen w-full p-4 flex justify-center ">
      <div
        className={`grid ${
          selectedUser ? "grid-cols-[25%_1fr_25%]" : "grid-cols-[50%_1fr]"
        } w-[80%] h-[calc(100vh-2rem)] rounded-lg bg-gray-400/10 backdrop-blur-lg border border-gray-100/20 shadow-lg`}
      >
        <div className="bg-white/5 rounded-l-lg">
          <Sidebar />
        </div>
        <ChatContainer />
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;
