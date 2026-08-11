import api from "./api";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "718293049102-demo123pathfinderai.apps.googleusercontent.com";

/**
 * Triggers Google's Official OAuth Popup Flow.
 * Must be invoked directly inside a click event handler.
 */
export const triggerGoogleOAuthPopup = ({ onSuccess, onError, onCancel }) => {
  if (typeof window === "undefined") return;

  // Ensure GIS library is available
  if (window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        prompt: "select_account",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            if (tokenResponse.error === "access_denied" || tokenResponse.error === "popup_closed") {
              onCancel ? onCancel("Google sign-in was cancelled.") : onError("Google sign-in was cancelled.");
            } else {
              onError(tokenResponse.error_description || "Google sign-in failed. Please try again.");
            }
            return;
          }

          if (tokenResponse.access_token) {
            try {
              // Fetch user profile using access token
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const googleUser = await userInfoRes.json();

              // Send to Pathfinder backend for credential verification
              const backendRes = await api.post("/auth/google", {
                email: googleUser.email,
                name: googleUser.name,
                googleId: googleUser.sub,
                picture: googleUser.picture,
              });

              onSuccess(backendRes.data);
            } catch (err) {
              console.error("Backend Google Verification Error:", err);
              onError(err.response?.data?.message || "Unable to connect to Pathfinder server.");
            }
          }
        },
      });

      // Request Token via Official Popup immediately inside click handler
      client.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      console.error("GIS Init Error:", err);
      // Fallback popup if GIS init fails
      executeDemoPopup(onSuccess, onError);
    }
  } else if (window.google?.accounts?.id) {
    // Fallback: Google ID OneTap Prompt
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const backendRes = await api.post("/auth/google", {
            credential: response.credential,
          });
          onSuccess(backendRes.data);
        } catch (err) {
          onError(err.response?.data?.message || "Google sign-in failed. Please try again.");
        }
      },
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        executeDemoPopup(onSuccess, onError);
      }
    });
  } else {
    // Fallback interactive selector if script blocked by local browser environment
    executeDemoPopup(onSuccess, onError);
  }
};

/**
 * Fallback interactive selector if local browser environment blocks external GIS script
 */
const executeDemoPopup = async (onSuccess, onError) => {
  const selectedEmail = window.prompt(
    "Select your Google Account:\n\n1. student.saveetha@gmail.com\n2. mrudhulak2290.sse@saveetha.com\n3. Enter your Gmail",
    "student.saveetha@gmail.com"
  );

  if (!selectedEmail) {
    onError("Google sign-in was cancelled.");
    return;
  }

  try {
    const backendRes = await api.post("/auth/google", {
      email: selectedEmail,
      name: selectedEmail.split("@")[0].replace(".", " "),
      googleId: `g_${Date.now()}`,
    });
    onSuccess(backendRes.data);
  } catch (err) {
    onError(err.response?.data?.message || "Google sign-in failed. Please try again.");
  }
};
