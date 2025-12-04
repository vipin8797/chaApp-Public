import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";



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

app.use("/api/status", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is live" });
});
app.use("/api/aut",userRouter);
app.use("/api/messages",messageRouter);



//Connect to MONGODB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
    });
