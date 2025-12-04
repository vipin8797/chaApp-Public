import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
} from "../controllers/messageController.js";

const messageRouter = express.Router({ mergeParams: true });

// Routes
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Important: specific route BEFORE dynamic route
messageRouter.get("/mark/:id", protectRoute, markMessageAsSeen);

// Dynamic message route last
messageRouter.get("/:id", protectRoute, getMessages);

export default messageRouter;
