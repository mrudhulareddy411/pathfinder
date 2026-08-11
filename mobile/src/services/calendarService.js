import api from "./api";

export const getEvents = async () => {
  try {
    const res = await api.get("/calendar/events");
    return res.data;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
};

export const createEvent = async (eventData) => {
  try {
    const res = await api.post("/calendar/events", eventData);
    return res.data;
  } catch (err) {
    console.error("Error creating event:", err);
    throw err;
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await api.delete(`/calendar/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
};
