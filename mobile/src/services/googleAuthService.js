import { Alert, Platform } from "react-native";
import api from "./api";

export const triggerGoogleOAuthPopup = ({ onSuccess, onError }) => {
  if (Platform.OS === "ios") {
    Alert.prompt(
      "Select Google Account",
      "Enter your Gmail (Mock Google Login)",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: async (email) => {
            if (!email) {
              onError("Google sign-in was cancelled.");
              return;
            }
            try {
              const backendRes = await api.post("/auth/google", {
                email: email,
                name: email.split("@")[0].replace(".", " "),
                googleId: `g_${Date.now()}`,
              });
              onSuccess(backendRes.data);
            } catch (err) {
              onError(err.response?.data?.message || "Google sign-in failed. Please try again.");
            }
          },
        },
      ],
      "plain-text",
      "student.saveetha@gmail.com"
    );
  } else {
    // Android doesn't support Alert.prompt natively with a text input.
    // We will just simulate a default account selection for demo purposes.
    Alert.alert(
      "Select Google Account (Mock)",
      "Log in as student.saveetha@gmail.com?",
      [
        { text: "Cancel", style: "cancel", onPress: () => onError("Google sign-in was cancelled.") },
        {
          text: "Login",
          onPress: async () => {
            const email = "student.saveetha@gmail.com";
            try {
              const backendRes = await api.post("/auth/google", {
                email: email,
                name: email.split("@")[0].replace(".", " "),
                googleId: `g_${Date.now()}`,
              });
              onSuccess(backendRes.data);
            } catch (err) {
              onError(err.response?.data?.message || "Google sign-in failed. Please try again.");
            }
          },
        },
      ]
    );
  }
};
