import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  return (
    selectedUser && (
      <div>
        <div className="flex flex-col items-center pt-16 px-2">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="rounded-full w-28 aspect-[1/1] border-2 border-white object-cover"
          />
          <h1 className="text-2xl text-white mt-4 flex font-serif items-center gap-2.5">
            <p className="rounded-full bg-green-400 w-2.5 h-2.5"></p>
            {selectedUser?.fullName}
          </h1>
          <div className="text-gray-300 px-5 pt-3.5 mx-auto text-sm">
            {selectedUser.bio}
          </div>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="text-white px-5">
          <p>Media</p>
          <div className="mt-2 max-h-[240px] overflow-y-auto overflow-hidden grid grid-cols-2 gap-4 opacity-80">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                className="overflow-hidden cursor-pointer hover:opacity-100 "
                onClick={() => window.open(url, "_blank")}
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center h-20">
          <button className="bg-violet-400 w-58 h-10 rounded-full text-white font-medium">
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
