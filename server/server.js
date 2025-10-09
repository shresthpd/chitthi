import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const server = http.createServer(app);

// middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// routes
app.use("/api/status", (req, res) => res.send("Server is Running"));
app.use("/api/auth", userRouter);

//connect to  db
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
