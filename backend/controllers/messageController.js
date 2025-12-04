import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io , userSocketMap} from "../app.js";


// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;

    // find other users (exclude logged-in)
    const filteredUsers = await User.find({ _id: { $ne: userId } })
      .select("-password")
      .lean();

    // Count number of unseen messages from each user -> more efficient with countDocuments
    const unseenMessages = {};

    const counts = await Promise.all(
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

    return res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};


//Get alll unseen messages for Selected User
export const getMessages = async (req, res) => {
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

    return res.json({ success: true, messages });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};





//api to mark message as seen using messag id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    // Find the message first
    const message = await Message.findById(id);

    if (!message) {
      return res.json({ success: false, message: "Message not found" });
    }

    // User can only mark messages received by them, not their own
    if (message.receiverId.toString() !== myId.toString()) {
      return res.json({
        success: false,
        message: "Not allowed to modify this message",
      });
    }

    // Update seen status
    message.seen = true;
    await message.save();

    return res.json({ success: true, message });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};




// Send message to selected User
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;     // FIXED (_id → id)
    const senderId = req.user._id;

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

    return res.json({ success: true, newMessage });

  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};
