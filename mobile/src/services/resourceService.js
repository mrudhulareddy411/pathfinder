import api from "./api";

export const getResources = async (category = "All") => {
  try {
    const res = await api.get(`/resources?category=${encodeURIComponent(category)}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching resources:", err);
    return [];
  }
};
