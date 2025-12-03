import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData]);

  return selectedUser ? (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg">

      {/* TOP BAR */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser?.profilePic} alt="" className="w-8 rounded-full" />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName || "Martin Johnson"}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>

        {/* MOBILE BACK BUTTON */}
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden w-7 cursor-pointer"
        />

        {/* DESKTOP HELP ICON */}
        <img src={assets.help_icon} alt="" className="max-md:hidden w-5" />
      </div>

      {/* CHAT MESSAGES */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => {
          const isMe = msg.senderId === "680f50e4f10f3cd28382ecf9";

          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-3 ${
                isMe ? "justify-end" : "flex-row-reverse"
              }`}
            >
              {/* IMAGE MESSAGE */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                />
              ) : (
                /* TEXT MESSAGE */
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light break-all text-white bg-violet-500/30 rounded-lg ${
                    isMe ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              {/* Avatar + Time */}
              <div className="text-center text-xs">
                <img
                  src={isMe ? assets.avatar_icon : assets.profile_martin}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* -----------Buttom Area/Chat Input ------------- */}
      <div className="absolute bottom-0 left-0 right-0 flex
      item-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12
        px-3 rounded-full"
        >
            <input type="text" placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg
            outline-none text-white placeholde-gray-400"/>
            <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image">
                <img src={assets.gallery_icon} alt=""
                className="w-5 mr-2 cursor-pointer"/>
            </label>
        </div>
         <img src={assets.send_button} alt="" className="w-7
         cursor-pointer"/>
      </div>


    </div>
  ) : (
    /* DEFAULT EMPTY SCREEN */
    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 bg-white/10 max-md:hidden h-full">
      <img src={assets.logo_icon} className="w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
