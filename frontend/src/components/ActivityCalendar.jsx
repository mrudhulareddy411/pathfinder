import { useState, useEffect } from "react";
import api from "../services/api";

function ActivityCalendar({ compact = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayActivities, setDayActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed (1-12)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/calendar?year=${year}&month=${month}`);
        setCalendarData(res.data.activitiesByDate || {});
      } catch (err) {
        console.error("Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const handleSelectDay = async (dateStr) => {
    setSelectedDay(dateStr);
    try {
      const res = await api.get(`/activity/day/${dateStr}`);
      setDayActivities(res.data.activities || []);
    } catch (err) {
      console.error("Day activity fetch error:", err);
    }
  };

  // Mathematically precise month calculations
  const daysInMonth = new Date(year, month, 0).getDate();
  // firstDayIndex: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  const firstDayIndex = new Date(year, month - 1, 1).getDay();

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-panel p-4 mb-4 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm">
      {/* Month Navigation Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
          <span>📅</span> <span className="text-gradient-indigo">{monthNames[month - 1]} {year}</span>
        </h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={handlePrevMonth}>
            &larr; Prev
          </button>
          <button className="btn btn-primary btn-sm px-3 rounded-pill" onClick={() => setCurrentDate(new Date())}>
            Today
          </button>
          <button className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={handleNextMonth}>
            Next &rarr;
          </button>
        </div>
      </div>

      {/* Activity Legend */}
      <div className="d-flex flex-wrap gap-3 mb-3 p-2.5 rounded-3 bg-light border extra-small">
        <span className="d-flex align-items-center gap-1 font-monospace fw-semibold"><span style={{ color: "#10b981" }}>🟢</span> Login Activity</span>
        <span className="d-flex align-items-center gap-1 font-monospace fw-semibold"><span style={{ color: "#2563eb" }}>🔵</span> Learning Modules</span>
        <span className="d-flex align-items-center gap-1 font-monospace fw-semibold"><span style={{ color: "#7c3aed" }}>🟣</span> Roadmap Progress</span>
        <span className="d-flex align-items-center gap-1 font-monospace fw-semibold"><span style={{ color: "#f59e0b" }}>🟠</span> Skill Challenges</span>
        <span className="d-flex align-items-center gap-1 font-monospace fw-semibold"><span style={{ color: "#0284c7" }}>🟡</span> Portfolio Project</span>
      </div>

      {/* 7-Column Header Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          textAlign: "center",
        }}
        className="font-monospace extra-small mb-2"
      >
        {daysOfWeek.map((day, idx) => (
          <div
            key={day}
            className={`fw-extrabold py-1.5 rounded ${idx === 0 || idx === 6 ? "text-primary bg-primary " : "text-dark bg-light"}`}
          >
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-4 text-secondary extra-small">Loading activity calendar...</div>
      ) : (
        /* 7-Column Days Grid (Precise mathematical alignment) */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px",
            textAlign: "center",
          }}
          className="font-monospace"
        >
          {/* Empty preceding slots for first week offset */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 rounded-3 bg-light opacity-25"></div>
          ))}

          {/* Days of month (1 to daysInMonth) */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const dayData = calendarData[dayStr];

            const isToday = dayStr === todayStr;
            const isSelected = dayStr === selectedDay;

            // Day of week index (0=Sun, 6=Sat)
            const dayOfWeekIdx = (firstDayIndex + idx) % 7;
            const isWeekend = dayOfWeekIdx === 0 || dayOfWeekIdx === 6;

            return (
              <button
                key={dayStr}
                onClick={() => handleSelectDay(dayStr)}
                className={`p-2 rounded-3 border transition-all d-flex flex-column align-items-center justify-content-between ${
                  isSelected
                    ? "border-primary bg-primary  shadow-sm"
                    : isToday
                    ? "border-warning bg-warning  shadow-sm"
                    : isWeekend
                    ? "border-secondary border-opacity-20 bg-light"
                    : "border-secondary border-opacity-15 bg-white"
                }`}
                style={{
                  minHeight: compact ? "46px" : "62px",
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-content-between align-items-center w-100 px-1">
                  <span className={`fw-extrabold extra-small ${isToday ? "text-warning" : "text-dark"}`}>
                    {dayNum}
                  </span>
                  {isToday && <span className="badge bg-warning text-dark extra-small px-1">Today</span>}
                </div>

                {/* Activity Markers */}
                {dayData && (
                  <div className="d-flex gap-0.5 flex-wrap justify-content-center mt-1">
                    {dayData.login && <span style={{ fontSize: "9px" }}>🟢</span>}
                    {dayData.learning && <span style={{ fontSize: "9px" }}>🔵</span>}
                    {dayData.roadmap && <span style={{ fontSize: "9px" }}>🟣</span>}
                    {dayData.challenge && <span style={{ fontSize: "9px" }}>🟠</span>}
                    {dayData.project && <span style={{ fontSize: "9px" }}>🟡</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Day Activity Drawer */}
      {selectedDay && (
        <div className="mt-4 p-3 rounded-4 bg-light border border-primary border-opacity-25 shadow-sm text-start">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <span>📅</span> Activity Log for {selectedDay}
            </h6>
            <button className="btn btn-link btn-sm text-secondary p-0 text-decoration-none" onClick={() => setSelectedDay(null)}>
              Close ✕
            </button>
          </div>

          {dayActivities.length === 0 ? (
            <p className="text-secondary extra-small mb-0">No Pathfinder activity recorded on this date.</p>
          ) : (
            <div className="d-flex flex-column gap-2 mt-2">
              {dayActivities.map((act) => (
                <div key={act._id || act.timestamp} className="p-2.5 rounded-3 bg-white border border-secondary border-opacity-20 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold text-primary extra-small">{act.activityType}</span>
                    <div className="text-muted extra-small">{new Date(act.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <span className="badge bg-success  text-success extra-small">✓ Verified Activity</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityCalendar;
