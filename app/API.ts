import axios from "axios";
import { useEffect } from "react";

let API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});

// Add an interceptor to set the Bearer token in the Authorization header for every request.
API.interceptors.request.use((config) => {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const token = localStorage.getItem("token"); // Replace with your Bearer token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const useAuth = () => {
  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem("token");
      if (!token) return window.location.replace("/admin/login");

      API.get(`auth/check`).catch((e) => {
        // router.push("/admin/login");
        window.location.replace("/admin/login");
      });
    };

    return check();
  }, []);
};
