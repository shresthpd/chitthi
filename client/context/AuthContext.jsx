// top-level imports and context setup
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"; // FIX: import from socket.io-client instead of server module

export const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // check if user is authenticated and if so, set the user data and connect to socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify session"); // FIX: safe error access
    }
  };

  // --- add: keep Authorization header in sync with token and persist token ---
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // --- add: login and logout helpers ---
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      if (data?.success) {
        setToken(data.token);
        setAuthUser(data.user);
        toast.success(data?.message || "Logged in successfully");
      } else {
        toast.error(data?.message || "Login failed");
      }
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      return error?.response?.data ?? { success: false, message };
    }
  };

  const signup = async (payload) => {
    try {
      const { data } = await axios.post("/api/auth/signup", payload);
      if (data?.success) {
        setToken(data.token);
        setAuthUser(data.user);
        toast.success(data?.message || "Account created successfully");
      } else {
        toast.error(data?.message || "Signup failed");
      }
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
      return error?.response?.data ?? { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };
  const updateProfile = async (payload) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", payload);
      if (data?.success) {
        setAuthUser(data.user);
        toast.success(data?.message || "Profile updated successfully");
        return data;
      } else {
        const message = data?.message || "Update failed";
        toast.error(message);
        return data ?? { success: false, message };
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Update failed";
      toast.error(message);
      return error?.response?.data ?? { success: false, message };
    }
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setAuthUser(null);
    }
  }, [token]);

  // --- add: connect socket when authenticated ---
  useEffect(() => {
    if (!token || !authUser) return;

    const s = io(backendUrl, {
      auth: { token },
      transports: ["websocket"],
    });
    setSocket(s);

    s.on("getOnlineUsers", (users) => setOnlineUsers(users));
    s.on("disconnect", () => setOnlineUsers([]));

    return () => {
      s.off("getOnlineUsers");
      s.disconnect();
    };
  }, [token, authUser]);

  const value = {
    axios,
    token,
    authUser,
    onlineUsers,
    socket,
    signup,
    login,
    logout,
    checkAuth,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
