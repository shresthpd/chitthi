import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on search query (use context users)
  const filteredUsers = users.filter((user) =>
    (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // select user -> set selected, clear unseen count, load messages
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
    getMessages(user._id);
  };

  return (
    <div className="h-full flex flex-col p-5 bg-transparent">
      <div className="flex justify-between items-center">
        <img src={assets.logo} alt="logo" className="w-40" />

        <div className="relative group">
          <img
            src={assets.menu_icon}
            alt="menu_icon"
            className="w-8 cursor-pointer hover:opacity-80 transition-opacity"
          />
          <div
            className="absolute right-0 mt-2 w-48 bg-slate-900/70 backdrop-blur-md rounded-lg shadow-xl z-10 p-2
                        invisible opacity-0 group-hover:visible group-hover:opacity-100 
                        transform scale-95 group-hover:scale-100 transition-all duration-200 ease-in-out"
          >
            <div
              onClick={() => navigate("/profile")}
              className="block px-4 py-2 text-sm text-gray-200 rounded-md hover:bg-slate-700/50 cursor-pointer"
            >
              Edit Profile
            </div>
            <div
              onClick={() => logout()}
              className="block px-4 py-2 text-sm text-gray-200 rounded-md hover:bg-slate-700/50 cursor-pointer"
            >
              Logout
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 bg-[#282142] rounded-full p-2 focus-within:ring-2 focus-within:ring-violet-400/50 transition-all">
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 h-4 object-contain"
        />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="outline-none bg-transparent w-full text-white placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-gray-400 hover:text-white text-xs"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col mt-4 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-700/50 rounded-lg transition-colors ${
                selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt=""
                className="w-10 aspect-square rounded-full cursor-pointer hover:opacity-80"
              />
              <div className="flex flex-col leading-5">
                <p className="text-white text-sm font-semibold">
                  {user.fullName}
                </p>
                {onlineUsers?.includes?.(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseenMessages?.[user._id] > 0 && (
                <p className="bg-violet-500 h-5 w-5 rounded-full flex justify-center items-center text-white text-xs ml-auto mr-2">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
