import React, { useContext, useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const navigate = useNavigate();
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // get all images from the messages
  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="h-full overflow-y-auto flex flex-col">
      <div className="flex flex-col items-center pt-10 px-2">
        <div className="relative">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="rounded-full w-28 aspect-[1/1] border-2 border-white object-cover hover:opacity-95 transition-opacity"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white"></div>
          )}
        </div>

        <h1 className="text-2xl text-white mt-4 font-serif">
          {selectedUser?.fullName}
        </h1>

        <div className="text-gray-300 px-5 pt-3.5 mx-auto text-sm text-center">
          {selectedUser.bio || "No bio available"}
        </div>
      </div>

      <hr className="border-[#ffffff30] my-4 mx-4" />

      <div className="text-white px-5 flex-1">
        <p className="font-medium mb-2">Media</p>
        {msgImages.length === 0 ? (
          <p className="text-gray-400 text-sm">No media shared</p>
        ) : (
          <div className="mt-2 max-h-[240px] overflow-y-auto overflow-hidden grid grid-cols-2 gap-4">
            {msgImages.map((url, index) => (
              <div
                key={index}
                className="overflow-hidden cursor-pointer rounded-md hover:opacity-100 opacity-80 transition-opacity transform hover:scale-105 duration-200"
                onClick={() => window.open(url, "_blank")}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center p-5 mt-auto">
        <button
          onClick={() => logout()}
          className="bg-violet-500 px-4 py-2 rounded-full text-white font-medium hover:bg-violet-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
