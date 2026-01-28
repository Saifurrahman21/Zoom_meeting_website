import axios, { HttpStatusCode } from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1️⃣ Create context FIRST
const AuthContext = createContext(null);

// 2️⃣ Axios client
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

// 3️⃣ Provider
export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Register
  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === HttpStatusCode.Created) {
        return request.data.message;
      }
    } catch (err) {
      throw err;
    }
  };

  // Login
  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === HttpStatusCode.Ok) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user);
        navigate("/");
      }
    } catch (err) {
      throw err;
    }
  };

  const value = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4️⃣ Custom hook (USED IN COMPONENTS)
export const useAuth = () => {
  return useContext(AuthContext);
};
