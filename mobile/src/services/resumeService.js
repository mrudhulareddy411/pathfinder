import api from "./api";

export const getResumes = async () => {
  try {
    const response = await api.get("/resumes");
    return response.data;
  } catch (err) {
    console.error("Error getting resumes:", err);
    return [];
  }
};

export const getResumeById = async (id) => {
  try {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error getting resume ${id}:`, err);
    return null;
  }
};

export const createResume = async (resumeData) => {
  try {
    const response = await api.post("/resumes", resumeData);
    return response.data;
  } catch (err) {
    console.error("Error creating resume:", err);
    throw err;
  }
};

export const updateResume = async (id, resumeData) => {
  try {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  } catch (err) {
    console.error(`Error updating resume ${id}:`, err);
    throw err;
  }
};

export const deleteResume = async (id) => {
  try {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error deleting resume ${id}:`, err);
    throw err;
  }
};
