import api from "./api";

export const getSkillGapData = async () => {
  try {
    const res = await api.get("/skill-gap");
    return res.data;
  } catch (err) {
    console.error("Error fetching skill gap data:", err);
    return null;
  }
};

export const updateSkillProficiency = async (skillName, level) => {
  try {
    const res = await api.put("/skill-gap/update-skill", { skillName, level });
    return res.data;
  } catch (err) {
    console.error("Error updating skill level:", err);
    throw err;
  }
};
