import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import { verifyEnv } from "./lib/envCheck.js";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";



// Verify environment variables on startup
verifyEnv();
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
  cors:{
    origin: "*",
  }
})

// Store Online Users:  { userId: socketId }
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  // Add user to map
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    // Remove from map
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});




// Midddlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.disable("x-powered-by"); // Hide Express signature

app.use("/api/status", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    message: "Server is live",
    environment: process.env.NODE_ENV || "development",
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    }
  });
});

// Morgan logging middleware (common format)
app.use(morgan("dev"));



app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

// Global Error Handler Middleware
app.use(errorHandler);



//Connect to MONGODB
await connectDB();

if(process.env.NODE_ENV != "production"){
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`🚀 Server successfully started and listening at port ${PORT}`);
    });
}

//Export server for vercer
export default server;

