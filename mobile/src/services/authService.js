import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    if (res.data && res.data.token) {
      await AsyncStorage.setItem("pf_token", res.data.token);
      if (res.data.user) {
        await AsyncStorage.setItem("pf_user", JSON.stringify(res.data.user));
      }
      return { success: true, token: res.data.token, user: res.data.user };
    }
    return { success: false, message: res.data?.message || "Login failed." };
  } catch (err) {
    console.error("Mobile Login Error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Server connection error.",
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    if (res.data && res.data.token) {
      await AsyncStorage.setItem("pf_token", res.data.token);
      if (res.data.user) {
        await AsyncStorage.setItem("pf_user", JSON.stringify(res.data.user));
      }
      return { success: true, token: res.data.token, user: res.data.user };
    }
    return { success: false, message: res.data?.message || "Registration failed." };
  } catch (err) {
    console.error("Mobile Register Error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Server connection error.",
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return { success: true, message: res.data?.message || "Reset link sent." };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to process forgot password request.",
    };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    return { success: true, message: res.data?.message || "Password reset successful." };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to reset password.",
    };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await api.put("/users/profile", profileData);
    if (res.data?.user) {
      await AsyncStorage.setItem("pf_user", JSON.stringify(res.data.user));
    }
    return { success: true, user: res.data?.user || res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update profile.",
    };
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("pf_token");
    await AsyncStorage.removeItem("pf_user");
  } catch (e) {
    console.error("Logout Error:", e);
  }
};

export const getStoredUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem("pf_user");
    if (userStr) return JSON.parse(userStr);
  } catch (e) {}
  return null;
};

