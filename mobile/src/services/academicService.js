import api from "./api";

export const getAcademicRecords = async () => {
  try {
    const res = await api.get("/academic");
    return res.data;
  } catch (err) {
    console.error("Error fetching academic records:", err);
    return { courses: [], gpa: 0.0 };
  }
};

export const addCourse = async (courseData) => {
  try {
    const res = await api.post("/academic/course", courseData);
    return res.data;
  } catch (err) {
    console.error("Error adding course:", err);
    throw err;
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const res = await api.put(`/academic/course/${id}`, courseData);
    return res.data;
  } catch (err) {
    console.error("Error updating course:", err);
    throw err;
  }
};

export const deleteCourse = async (id) => {
  try {
    const res = await api.delete(`/academic/course/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting course:", err);
    throw err;
  }
};
