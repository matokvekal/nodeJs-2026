import "./Home.css";

function Home({ courseData, onSelectDay }) {
  const days = Object.entries(courseData);

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">Node.js 2026</h1>
        <p className="home-subtitle">קורס מלא – 4 ימים, 16 מצגות</p>
      </div>

      <div className="days-grid">
        {days.map(([key, day], idx) => {
          const available = day.presentations.some((p) => p.available);
          return (
            <div
              key={key}
              className={`day-card ${available ? "available" : "locked"}`}
              style={{ "--day-color": day.color }}
              onClick={() => available && onSelectDay(key)}
            >
              <div className="day-number">יום {idx + 1}</div>
              <h2 className="day-title">{day.title}</h2>
              <p className="day-subtitle">{day.subtitle}</p>
              <p className="day-desc">{day.description}</p>
              <div className="day-meta">
                <span className="pres-count">
                  {day.presentations.filter((p) => p.available).length} /{" "}
                  {day.presentations.length} מצגות
                </span>
                {available ? (
                  <span className="day-badge ready">מוכן</span>
                ) : (
                  <span className="day-badge soon">בקרוב</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="home-footer">
        <span>השתמש ב-← → לניווט · F למסך מלא · ESC לסגירה</span>
      </div>
    </div>
  );
}

export default Home;
