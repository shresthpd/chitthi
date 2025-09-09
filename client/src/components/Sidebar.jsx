import React from "react";
import assets, { userDummyData } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col p-5 bg-transparent">
      {/* Logo + Menu */}
      <div className="flex justify-between items-center">
        <img src={assets.logo} alt="logo" className="w-40" />

        {/* Menu Icon and Dropdown */}
        <div className="relative group">
          <img
            src={assets.menu_icon}
            alt="menu_icon"
            className="w-8 cursor-pointer"
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
              onClick={() => navigate("/login")}
              className="block px-4 py-2 text-sm text-gray-200 rounded-md hover:bg-slate-700/50 cursor-pointer"
            >
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 bg-[#282142] rounded-full p-2">
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 h-4 object-contain"
        />
        <input
          type="text"
          placeholder="Search"
          className="outline-none bg-transparent w-full text-white placeholder:text-gray-400"
        />
      </div>

      {/* User List */}
      <div className="flex-1 flex flex-col mt-4 overflow-y-auto">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-700/50 rounded-lg ${
              selectedUser?._id === user._id && "bg-[#282142]/50"
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
              {index < 3 ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {index >= 2 && (
              <p className="bg-violet-500 h-5 w-5 rounded-full flex justify-center items-center text-white text-xs ml-auto mr-2">
                {index}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
