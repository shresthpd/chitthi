import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    // count no. of unread messages
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      unseenMessages[user._id] = messages.length;
    });
    await Promise.all(promises);
    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error("getUsersForSidebar error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    if (!selectedUserId) {
      return res.status(400).json({ success: false, message: "Selected user id is required" });
    }
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      {
        seen: true,
      }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to mark message as seen using message id
export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Message id is required" });
    }
    const updated = await Message.findByIdAndUpdate(id, { seen: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("markMessageSeen error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver id is required" });
    }
    if (!text && !image) {
      return res.status(400).json({ success: false, message: "Message content is required (text or image)" });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // emit new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
