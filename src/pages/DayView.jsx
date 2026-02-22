import "./DayView.css";

function DayView({ day, dayKey, onBack, onSelectPresentation }) {
  const isPresCompleted = (pres) => {
    const completionKey = `${pres.storageKey}-completed`;
    return localStorage.getItem(completionKey) === "true";
  };

  return (
    <div className="day-view">
      <div className="day-view-header">
        <button className="dv-back-btn" onClick={onBack}>
          → חזור לדף הבית
        </button>
        <div className="dv-title-block">
          <h1 className="dv-title" style={{ "--day-color": day.color }}>
            {day.title}
          </h1>
          <p className="dv-subtitle">{day.subtitle}</p>
        </div>
      </div>

      <div className="presentations-grid">
        {day.presentations.map((pres, idx) => {
          const isCompleted = isPresCompleted(pres);
          return (
            <div
              key={pres.id}
              className={`pres-card ${pres.available ? "available" : "locked"} ${isCompleted ? "completed" : ""}`}
              style={{ "--day-color": day.color }}
            >
              {isCompleted && (
                <div className="completion-badge">
                  <span className="checkmark">✓</span>
                  הושלם
                </div>
              )}
              <div className="pres-number">מצגת {idx + 1}</div>
              <h2 className="pres-title">{pres.title}</h2>
              <p className="pres-subtitle">{pres.subtitle}</p>

              <div className="pres-meta">
                {pres.available ? (
                  <span className="pres-slides-count">
                    {pres.slides?.length || 0} שקפים
                  </span>
                ) : (
                  <span className="pres-coming">בקרוב</span>
                )}
              </div>

              {pres.available && (
                <div className="pres-actions">
                  <button
                    className="btn-primary"
                    onClick={() => onSelectPresentation(idx)}
                  >
                    פתח מצגת
                  </button>
                </div>
              )}

              {!pres.available && (
                <div className="pres-locked-msg">🔒 יתווסף בקרוב</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DayView;
