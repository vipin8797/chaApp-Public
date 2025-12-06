import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111b21] xl:p-5">
      <div
        className={`w-full max-w-[1600px] h-screen xl:h-[95vh] bg-[#222e35] xl:rounded-lg overflow-hidden flex shadow-lg border border-gray-800
        ${selectedUser ? "" : ""}`}
      >
        {/* Sidebar always visible on large screens, hidden on mobile if chat selected */}
        <div className={`w-full md:w-[350px] xl:w-[400px] bg-[#111b21] border-r border-[#2f3b43] flex-shrink-0 
          ${selectedUser ? "hidden md:flex" : "flex"}`}>
          <Sidebar />
        </div>

        {/* Chat Area */}
        <div className={`flex-1 bg-[#0b141a] relative flex flex-col 
          ${!selectedUser ? "hidden md:flex" : "flex"}`}>
           <ChatContainer />
        </div>

        {/* Right Sidebar (Optional Info) */}
        <div className={`w-[300px] bg-[#111b21] border-l border-[#2f3b43] 
          ${selectedUser ? "hidden xl:block" : "hidden"}`}>
           <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;