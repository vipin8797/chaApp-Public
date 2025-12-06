import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    if (messages) {
      setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
    }
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="h-full w-full bg-[#0b141a] border-l border-[#202c33] overflow-y-scroll custom-scrollbar text-[#e9edef]">
      
      {/* --- HEADER: Contact Info --- */}
      <div className="bg-[#111b21] pb-6 pt-8 flex flex-col items-center shadow-sm">
        <div className="relative">
             <img
                src={selectedUser.profilePic || assets.avatar_icon}
                alt=""
                className="w-40 h-40 rounded-full object-cover mb-4 hover:opacity-90 transition cursor-pointer"
             />
             {onlineUsers.includes(selectedUser._id) && (
                 <span className="absolute bottom-4 right-4 w-4 h-4 bg-[#00a884] border-4 border-[#111b21] rounded-full"></span>
             )}
        </div>
        
        <h2 className="text-xl font-normal text-[#e9edef] mt-2">
            {selectedUser.fullName}
        </h2>
        <p className="text-[#8696a0] text-lg mt-1 font-light">
            {selectedUser.bio || "+91 98765 43210"} {/* Phone number placeholder style */}
        </p>
      </div>

      {/* --- THICK SEPARATOR (Like WhatsApp) --- */}
      <div className="h-3 bg-[#0b141a] w-full border-t border-b border-[#202c33]"></div>

      {/* --- MEDIA SECTION --- */}
      <div className="bg-[#111b21] p-4 flex-1">
        <div className="flex justify-between items-center mb-4 text-[#8696a0] text-sm font-medium">
            <span>Media, links and docs</span>
            <span className="cursor-pointer hover:text-[#e9edef] text-xs">
                {msgImages.length} >
            </span>
        </div>

        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {msgImages.slice(0, 6).map((url, index) => (
              <div 
                key={index} 
                className="relative aspect-square cursor-pointer overflow-hidden rounded bg-[#202c33]"
                onClick={() => window.open(url)}
              >
                <img src={url} alt="media" className="w-full h-full object-cover hover:scale-105 transition" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-[#8696a0] text-sm">
            No media shared
          </div>
        )}
      </div>

      {/* --- SEPARATOR --- */}
      <div className="h-3 bg-[#0b141a] w-full border-t border-b border-[#202c33]"></div>

      {/* --- ACTIONS / LOGOUT --- */}
      <div className="bg-[#111b21] p-4 space-y-4">
        
        <div className="flex items-center gap-4 text-[#ef5350] cursor-pointer hover:bg-[#202c33] p-3 rounded-lg transition"
             onClick={logout}>
            <img src={assets.logo_icon} className="w-6 invert opacity-30" alt="" /> 
            <span className="text-base">Block {selectedUser.fullName} (Logout)</span>
        </div>

        <div className="flex items-center gap-4 text-[#ef5350] cursor-pointer hover:bg-[#202c33] p-3 rounded-lg transition">
            <span className="w-6 text-center text-xl">👎</span>
            <span className="text-base">Report {selectedUser.fullName}</span>
        </div>

      </div>
      
      {/* Footer Padding */}
      <div className="h-20 bg-[#0b141a]"></div>

    </div>
  );
};

export default RightSidebar;