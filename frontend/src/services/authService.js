import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("pf_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("pf_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const loginUser = async (emailOrCredentials, password) => {
  let credentials;
  if (typeof emailOrCredentials === "object" && emailOrCredentials !== null) {
    credentials = emailOrCredentials;
  } else {
    credentials = { email: emailOrCredentials, password };
  }

  const response = await api.post("/auth/login", credentials);
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("pf_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("pf_user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
    localStorage.setItem("pf_user", JSON.stringify(response.data));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("pf_token");
  localStorage.removeItem("user");
  localStorage.removeItem("pf_user");
};
