import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

// socket.io initialization
export const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGIN,
    credentials: true,
  },
});

// store online users
export const userSocketMap = {}; // { userId:socketId }

// socket.io connection handeler
io.on("connection", (socket) => {
  const { token } = socket.handshake.auth || {};
  let userId;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      console.log("Socket auth failed", e.message);
      socket.disconnect();
      return;
    }
  } else {
    socket.disconnect();
    return;
  }
  console.log("user connected", userId);
  userSocketMap[userId] = socket.id;

  // emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));

// routes
app.use("/api/status", (req, res) => res.send("Server is Running"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to  db
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
