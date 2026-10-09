import { useState, useEffect } from "react";
import api from "../services/api";

function CalendarEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState("Academic");
  const [description, setDescription] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/calendar/events");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !date) return;
    try {
      await api.post("/calendar/events", { title, date, type, description });
      setShowForm(false);
      setTitle("");
      setDescription("");
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/calendar/events/${id}`);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel p-4 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
          <span>📅</span> Academic Events
        </h5>
        <button className="btn btn-primary btn-sm rounded-pill fw-bold" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Event"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-light rounded-3 border">
          <div className="mb-2">
            <label className="form-label small fw-bold">Title</label>
            <input className="form-control form-control-sm" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label className="form-label small fw-bold">Date</label>
              <input type="date" className="form-control form-control-sm" required value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small fw-bold">Type</label>
              <select className="form-select form-select-sm" value={type} onChange={e => setType(e.target.value)}>
                <option>Academic</option>
                <option>Personal</option>
                <option>Career</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Description</label>
            <input className="form-control form-control-sm" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-success btn-sm fw-bold w-100">Save Event</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-3 small text-muted">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-4 bg-light rounded-3 border border-secondary border-opacity-20 text-muted small">
          No upcoming events.
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {events.map(ev => (
            <div key={ev._id} className="p-3 rounded-3 border d-flex justify-content-between align-items-center border-primary border-opacity-20 bg-white shadow-sm transition-hover">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-primary text-light extra-small px-2 py-1 rounded-pill">{ev.type}</span>
                  <span className="fw-bold text-dark small">{ev.title}</span>
                </div>
                <div className="extra-small text-muted">{new Date(ev.date).toLocaleDateString()} {ev.description && `- ${ev.description}`}</div>
              </div>
              <button className="btn btn-light btn-sm text-danger border-0 p-1" onClick={() => handleDelete(ev._id)}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalendarEvents;
