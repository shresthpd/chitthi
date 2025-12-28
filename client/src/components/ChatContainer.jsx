import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatTime } from "../lib/utils.js";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const scrollEnd = useRef(null);
  const chatAreaRef = useRef(null);
  const { messages, selectedUser, setSelectedUser, getMessages, sendMessage } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState("");
  const scrollToBottom = (smooth = true) => {
    if (!scrollEnd.current) return;
    requestAnimationFrame(() => {
      scrollEnd.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user to chat with.");
      return;
    }

    const content = messageInput.trim();
    if (content === "") return;

    await sendMessage({ text: content });
    setMessageInput("");
    scrollToBottom();
  };

  const handleSendingImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Invalid file type!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
      scrollToBottom();
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [selectedUser, messages]);

  useEffect(() => {
    if (chatAreaRef.current) {
      scrollToBottom(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

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

        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="rounded-full w-9"
        />

        <p className="text-lg text-white flex-1 ml-4 font-serif flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-400" />
          )}
        </p>

        <img src={assets.help_icon} alt="" className="rounded-full w-5" />
      </div>

      {/* ---------------CHAT AREA (the only scrollable part)----------------- */}
      <div
        ref={chatAreaRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex justify-end gap-2 ${
              msg.senderId !== authUser._id ? "flex-row-reverse" : ""
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
                  msg.senderId !== authUser._id
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
                  msg.senderId === authUser._id
                    ? authUser.profilePic || assets.avatar_icon
                    : selectedUser.profilePic || assets.avatar_icon
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
            onChange={(e) => setMessageInput(e.target.value)}
            value={messageInput}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Type a message"
            className="w-full bg-transparent outline-none"
          />

          <input
            type="file"
            id="image"
            hidden
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleSendingImage}
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
          onClick={(e) => {
            handleSendMessage(e);
          }}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
