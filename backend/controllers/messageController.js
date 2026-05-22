import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../app.js";
import { HTTP_STATUS } from "../lib/statusCodes.js";


// Get all users except the logged in user
export const getUsersForSidebar = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Unauthorized access" });
    }

    const userId = req.user._id;

    // find other users (exclude logged-in)
    const filteredUsers = await User.find({ _id: { $ne: userId } })
      .select("-password")
      .lean();

    // Count number of unseen messages from each user -> more efficient with countDocuments
    const unseenMessages = {};

    await Promise.all(
      filteredUsers.map((user) =>
        Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        }).then((count) => {
          if (count > 0) unseenMessages[user._id.toString()] = count;
        })
      )
    );

    return res.status(HTTP_STATUS.OK).json({ success: true, users: filteredUsers, unseenMessages });
  } catch (err) {
    next(err);
  }
};


//Get alll unseen messages for Selected User
export const getMessages = async (req, res, next) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // 1. Fetch messages between two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    // 2. Mark incoming messages as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    return res.status(HTTP_STATUS.OK).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};





//api to mark message as seen using messag id
export const markMessageAsSeen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    // Find the message first
    const message = await Message.findById(id);

    if (!message) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Message not found" });
    }

    // User can only mark messages received by them, not their own
    if (message.receiverId.toString() !== myId.toString()) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: "Not allowed to modify this message",
      });
    }

    // Update seen status
    message.seen = true;
    await message.save();

    return res.status(HTTP_STATUS.OK).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};




// Send message to selected User
export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;     // FIXED (_id → id)
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Message content cannot be empty" });
    }

    let imageUrl = "";                    // FIXED (initialize)
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;   // FIXED (- → =)
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Emit the new message to receiver socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(HTTP_STATUS.CREATED).json({ success: true, newMessage });

  } catch (err) {
    next(err);
  }
};
