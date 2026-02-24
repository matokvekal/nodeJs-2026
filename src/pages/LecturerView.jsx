import { useRef, useState, useEffect } from "react";
import ExercisesModal from "../components/ExercisesModal";
import "./LecturerView.css";

const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

function LecturerSlide({ slide, dayColor, slideNumber }) {
  if (!slide || slide.type === "quiz") return null;

  const isTitle = slide.type === "title";

  return (
    <div className={`lec-slide ${isTitle ? "lec-slide--title" : ""}`}>
      <span className="lec-slide-num" style={{ "--day-color": dayColor }}>
        שקף {slideNumber}
      </span>
      {slide.title && (
        <h4
          className="lec-slide-title"
          style={{ "--day-color": dayColor }}
        >
          {slide.title}
        </h4>
      )}
      {slide.subtitle && (
        <p className="lec-slide-subtitle">{slide.subtitle}</p>
      )}
      {slide.bullets && slide.bullets.length > 0 && (
        <ul className="lec-bullets">
          {slide.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {slide.code && (
        <pre className="lec-code">
          <code>{slide.code}</code>
        </pre>
      )}
      {slide.note && (
        <div className="lec-note">
          <span className="lec-note-icon">💡</span>
          <span>{slide.note}</span>
        </div>
      )}
    </div>
  );
}

function LecturerView({ courseData, onBack }) {
  const days = Object.entries(courseData);
  const mainRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exercises, setExercises] = useState(null); // { presId, presTitle }

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const sections = container.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { root: container, rootMargin: "0px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const totalSlides = days.reduce(
    (acc, [, day]) =>
      acc + day.presentations.reduce((a, p) => a + (p.slides?.length || 0), 0),
    0
  );

  return (
    <div className="lecturer-view">
      {/* ── Top Bar ── */}
      <header className="lec-topbar">
        <div className="lec-topbar-left">
          <button className="lec-back-btn" onClick={onBack}>
            ← בית
          </button>
          <button
            className="lec-sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title="תפריט ניווט"
          >
            ☰
          </button>
        </div>
        <span className="lec-topbar-title">מצב מרצה — Node.js 2026</span>
        <span className="lec-topbar-meta">
          {days.length} ימים · 16 שיעורים · {totalSlides} שקפים
        </span>
      </header>

      <div className="lec-body">
        {/* ── Sidebar ── */}
        <nav className={`lec-sidebar ${sidebarOpen ? "open" : "closed"}`}>
          {days.map(([key, day], dayIdx) => (
            <div key={key} className="lec-nav-day">
              <button
                className={`lec-nav-day-btn ${activeId === `day-${key}` ? "active" : ""}`}
                style={{ "--day-color": day.color }}
                onClick={() => scrollTo(`day-${key}`)}
              >
                יום {dayIdx + 1} — {day.title}
              </button>
              {day.presentations.map((pres, presIdx) => (
                <button
                  key={pres.id}
                  className={`lec-nav-lesson-btn ${activeId === `lesson-${pres.id}` ? "active" : ""}`}
                  style={{ "--day-color": day.color }}
                  onClick={() => scrollTo(`lesson-${pres.id}`)}
                >
                  <span className="lec-nav-num">
                    {dayIdx + 1}.{presIdx + 1}
                  </span>
                  <span className="lec-nav-label">{pres.title}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Main Content ── */}
        <main className="lec-main" ref={mainRef}>
          {days.map(([key, day], dayIdx) => (
            <section key={key}>
              {/* Day divider card */}
              <div
                id={`day-${key}`}
                data-section
                className="lec-day-card"
                style={{ "--day-color": day.color }}
              >
                <div className="lec-day-eyebrow">יום {dayIdx + 1}</div>
                <h2 className="lec-day-title">{day.title}</h2>
                <p className="lec-day-sub">{day.subtitle}</p>
                <p className="lec-day-desc">{day.description}</p>
              </div>

              {/* Lessons */}
              {day.presentations.map((pres, presIdx) => (
                <div key={pres.id} className="lec-lesson">
                  {/* Lesson header card — sticky while scrolling through slides */}
                  <div
                    id={`lesson-${pres.id}`}
                    data-section
                    className="lec-lesson-header"
                    style={{ "--day-color": day.color }}
                  >
                    <div className="lec-lesson-header-left">
                      <span className="lec-lesson-num">
                        {dayIdx + 1}.{presIdx + 1}
                      </span>
                      <div>
                        <h3 className="lec-lesson-title">{pres.title}</h3>
                        <p className="lec-lesson-sub">{pres.subtitle}</p>
                      </div>
                    </div>
                    <button
                      className="lec-exercises-link"
                      onClick={() => setExercises({ presId: pres.id, presTitle: pres.title })}
                    >
                      <GitHubIcon />
                      תרגילים
                    </button>
                  </div>

                  {/* All slides inline — scroll through */}
                  <div className="lec-slides-list">
                    {pres.slides?.map((slide, slideIdx) => (
                      <LecturerSlide
                        key={slide.id}
                        slide={slide}
                        dayColor={day.color}
                        slideNumber={slideIdx + 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}

          <div className="lec-footer">Node.js 2026 · מצב מרצה</div>
        </main>
      </div>

      {exercises && (
        <ExercisesModal
          presId={exercises.presId}
          presTitle={exercises.presTitle}
          onClose={() => setExercises(null)}
        />
      )}
    </div>
  );
}

export default LecturerView;
