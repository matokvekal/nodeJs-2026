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
                  {pres.githubLink && (
                    <a
                      href={pres.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-code-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      הצג קוד
                    </a>
                  )}
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
