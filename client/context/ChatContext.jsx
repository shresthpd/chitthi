import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // list of users for the sidebar
  const [selectedUser, setSelectedUser] = useState(null); // selected user for the chat
  const [unseenMessages, setUnseenMessages] = useState({}); // { userId: count }

  const { axios, socket } = useContext(AuthContext);

  // function to get all users for the sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    }
  };

  // function to get messages for a user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    }
  };

  // function to send a message
  const sendMessage = async (message) => {
    if (!selectedUser?._id) {
      toast.error("Please select a user to chat with.");
      return;
    }

    try {
      const payload = typeof message === "string" ? { text: message } : message;

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        payload
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        console.log(data.message);
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || "Failed to send message";
      toast.error(msg);
    }
  };

  // function to subscribe to messages for selected user
  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]:
            (prevUnseenMessages[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setUnseenMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
