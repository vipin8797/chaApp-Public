import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);         // FIXED

  // ----------- CHECK AUTH -----------
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);                    // FIXED
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ----------- CONNECT SOCKET -----------
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);                       // FIXED
    });
  };

  // ----------- ON MOUNT RUN AUTH CHECK -----------
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // FIXED
      checkAuth();
    }
  }, [token]);                                        // FIXED

  // ----------- CONTEXT VALUE -----------
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    setToken,
    setAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



// 🧠 Summary in Simple Hinglish

// Yeh pura code basically:

// 🔥 App start hote hi:

// token aya to backend ko checkAuth() call hota hai

// backend bolta hai:
// ✔ yes user valid
// → authUser state set hoti hai
// → socket connection open hota hai

// 🔥 Socket connect hote hi:

// backend ko userId bhej di jaati hai

// backend sab clients ko ek list bhejta hai:
// kaun online hai

// 🔥 onlineUsers state me woh list store hoti hai

// tum UI me green dots ya active users dikhane ke liye use karoge.