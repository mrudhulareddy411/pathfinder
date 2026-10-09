import api from "./api";

export const getCareers = async (searchQuery = "") => {
  try {
    const res = await api.get(`/careers?q=${encodeURIComponent(searchQuery)}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching careers:", err);
    return [];
  }
};

export const getCareerByOnet = async (onetCode) => {
  try {
    const res = await api.get(`/careers/${onetCode}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching career ${onetCode}:`, err);
    return null;
  }
};

export const getRecommendations = async () => {
  try {
    const res = await api.get("/recommendations");
    return res.data;
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return null;
  }
};

export const setTargetCareer = async (careerData) => {
  try {
    const res = await api.post("/recommendations/select", careerData);
    return res.data;
  } catch (err) {
    console.error("Error setting target career:", err);
    return null;
  }
};
