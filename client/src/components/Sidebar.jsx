import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  useEffect(() => { getUsers(); }, [onlineUsers]);

  return (
    <div className="flex flex-col h-full w-full bg-[#111b21]">
      
      {/* HEADER */}
      <div className="h-16 bg-[#202c33] px-4 flex items-center justify-between shadow-sm shrink-0">
        <img src={assets.logo} alt="logo" className="w-8 h-8 rounded-full" />
        <div className="flex gap-4 text-[#aebac1]">
            <button onClick={() => navigate("/profile")} title="Profile"><img src={assets.menu_icon} className="w-6 opacity-70" alt="" /></button>
            <button onClick={logout} title="Logout"><img src={assets.arrow_icon} className="w-6 opacity-70 rotate-180" alt="" /></button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-3 py-2 border-b border-[#202c33]">
        <div className="flex items-center bg-[#202c33] rounded-lg px-3 py-1.5">
            <img src={assets.search_icon} className="w-4 opacity-50 mr-3" alt="" />
            <input
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Search or start new chat"
                className="bg-transparent border-none outline-none text-[#d1d7db] text-sm w-full placeholder-[#8696a0]"
            />
        </div>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b border-[#202c33] hover:bg-[#202c33] transition
            ${selectedUser?._id === user._id ? "bg-[#2a3942]" : ""}`}
          >
            <div className="relative">
                <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-12 h-12 rounded-full object-cover" />
                {onlineUsers?.includes(user._id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></span>}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                    <h4 className="text-[#e9edef] font-normal text-[17px] truncate">{user.fullName}</h4>
                    <span className="text-xs text-[#8696a0]">
                        {onlineUsers?.includes(user._id) ? "Online" : "Yesterday"}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[#8696a0] text-sm truncate w-[80%]">Click to start chatting</p>
                    {unseenMessages[user._id] > 0 && (
                        <span className="bg-[#00a884] text-[#111b21] text-xs font-bold px-1.5 py-0.5 rounded-full">{unseenMessages[user._id]}</span>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;