import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatTime } from "../lib/utils.js";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef(null);
  const chatAreaRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (!scrollEnd.current) return;
    requestAnimationFrame(() => {
      scrollEnd.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [selectedUser, messagesDummyData.length]);

  useEffect(() => {
    if (chatAreaRef.current) {
      scrollToBottom(false);
    }
  }, []);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <img src={assets.logo_big} alt="" className="mx-auto mt-5 w-36" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* ---------------HEADER (no bg, no blur)----------------- */}
      <div className="flex-none flex items-center justify-between px-3 py-3 border-b border-slate-400">
        <img
          src={assets.arrow_icon}
          alt="Back"
          className="w-5 h-5 mr-4 cursor-pointer"
          onClick={() => setSelectedUser(null)}
        />

        <img src={assets.profile_martin} alt="" className="rounded-full w-9" />

        <p className="text-lg text-white flex-1 ml-4 font-serif flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-400" />
        </p>

        <img src={assets.help_icon} alt="" className="rounded-full w-5" />
      </div>

      {/* ---------------CHAT AREA (the only scrollable part)----------------- */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-4"
      >
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex justify-end gap-2 ${
              msg.senderId !== "680f50e4f10f3cd28382ecf9"
                ? "flex-row-reverse"
                : ""
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[200px] rounded-lg border-2 border-slate-400"
                onLoad={() => scrollToBottom()}
              />
            ) : (
              <p
                className={`max-w-[250px] rounded-lg p-3 font-light text-white ${
                  msg.senderId !== "680f50e4f10f3cd28382ecf9"
                    ? "bg-slate-600 rounded-bl-none"
                    : "bg-purple-600 rounded-br-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className="flex flex-col items-center justify-end">
              <img
                src={
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                className="w-8 h-8 rounded-full"
                alt=""
              />
              <p className="text-xs text-slate-200">
                {formatTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}

        <div ref={scrollEnd} />
      </div>

      {/* ---------------BOTTOM AREA (no bg on wrapper, no margins)----------------- */}
      <div className="flex-none w-full flex items-center px-3 py-2">
        <div className="w-full px-5 py-3 rounded-4xl bg-slate-700 text-white placeholder:text-slate-400 flex items-center gap-3 mr-2">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full bg-transparent outline-none"
          />

          <input
            type="file"
            id="image"
            hidden
            accept="image/png,image/jpeg,image/jpg"
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Attach"
              className="w-6 h-6 cursor-pointer"
            />
          </label>
        </div>

        <img
          src={assets.send_button}
          alt="Send"
          className="w-10 h-10 cursor-pointer"
          onClick={() => {
            scrollToBottom();
          }}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
