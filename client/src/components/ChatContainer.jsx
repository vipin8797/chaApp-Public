import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return toast.error("Select an image");
    const reader = new FileReader();
    reader.onloadend = async () => { await sendMessage({ image: reader.result }); };
    reader.readAsDataURL(file);
  };

  useEffect(() => { if (selectedUser) getMessages(selectedUser._id); }, [selectedUser]);
  useEffect(() => { scrollEnd.current?.scrollIntoView(); }, [messages]);

  if (!selectedUser) return (
    <div className="flex flex-col items-center justify-center h-full bg-[#222e35] text-[#aebac1] border-b-[6px] border-[#00a884]">
        <img src={assets.logo_icon} className="w-20 opacity-40 mb-5" alt="" />
        <h1 className="text-3xl font-light text-[#e9edef]">Chat App</h1>
        <p className="mt-4 text-sm">Send and receive messages without keeping your phone online.</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0b141a] relative">
      {/* HEADER */}
      <div className="h-16 bg-[#202c33] px-4 flex items-center gap-4 shrink-0 shadow-sm z-10">
        <button onClick={() => setSelectedUser(null)} className="md:hidden"><img src={assets.arrow_icon} className="w-6 invert" alt="" /></button>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 rounded-full object-cover cursor-pointer" />
        <div className="flex-1 cursor-pointer">
          <h3 className="text-[#e9edef] font-medium">{selectedUser.fullName}</h3>
          <p className="text-xs text-[#8696a0]">{onlineUsers?.includes(selectedUser._id) ? "online" : "click for info"}</p>
        </div>
      </div>

      {/* MESSAGES - Background image pattern effect */}
      <div className="flex-1 overflow-y-auto p-4 sm:px-10 space-y-2 relative" 
           style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundColor: "#0b141a"}}>
        
        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`relative max-w-[65%] sm:max-w-[50%] p-2 rounded-lg text-sm shadow-md 
                ${isMe ? "bg-[#005c4b] rounded-tr-none text-[#e9edef]" : "bg-[#202c33] rounded-tl-none text-[#e9edef]"}`}>
                
                {msg.image && <img src={msg.image} alt="img" className="rounded-lg mb-2 border border-white/5" />}
                {msg.text && <p className="px-1">{msg.text}</p>}
                
                <p className={`text-[10px] text-right mt-1 ${isMe ? "text-[#8696a0]" : "text-[#8696a0]"}`}>
                   {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT AREA */}
      <div className="bg-[#202c33] px-4 py-2 flex items-center gap-3 shrink-0">
        <label htmlFor="file-input" className="cursor-pointer text-[#8696a0] hover:text-[#d1d7db]">
            <img src={assets.gallery_icon} className="w-6 opacity-60" alt="+" />
        </label>
        <input onChange={handleSendImage} type="file" id="file-input" hidden accept="image/*" />

        <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center px-3 py-2">
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                type="text" 
                placeholder="Type a message" 
                className="w-full bg-transparent border-none outline-none text-[#d1d7db] text-sm placeholder-[#8696a0]" 
            />
        </div>
        
        <button onClick={handleSendMessage} className="p-2">
            <img src={assets.send_button} className="w-6 opacity-60 hover:opacity-100" alt="send" />
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;