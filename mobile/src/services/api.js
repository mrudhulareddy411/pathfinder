import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Detect suitable backend URL for Android Emulator vs iOS Simulator vs Local Network
const getBaseUrl = () => {
  // Use the local network IP so the physical phone can access the backend server
  return "http://172.18.102.48:5000/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject Bearer token from AsyncStorage into headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("pf_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("Error getting token from AsyncStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
