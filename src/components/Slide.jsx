import { useEffect, useState } from "react";
import AnimationModal from "./AnimationModal";
import CodeModal from "./CodeModal";
import Quiz from "./Quiz";
import AIInfo from "./AIInfo";
import "./Slide.css";

/* ── helpers ── */
function BulletList({ bullets }) {
  if (!bullets) return null;
  return (
    <ul className="bullet-list">
      {bullets.map((b, i) => (
        <li
          key={i}
          className="bullet-item"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <span className="bullet-marker">▸</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonTable({ data }) {
  if (!data) return null;
  return (
    <div className="comparison-table">
      <table>
        <thead>
          <tr>
            {data.headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── main component ── */
function Slide({ data, currentPanel, onNextPanel, onPrevPanel }) {
  const [animate, setAnimate] = useState(false);
  const [panelKey, setPanelKey] = useState(0);
  const [panelDir, setPanelDir] = useState("right");
  const [modalOpen, setModalOpen] = useState(false);
  const [animType, setAnimType] = useState(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(null);

  /* slide entrance */
  useEffect(() => {
    setAnimate(false);
    setModalOpen(false);
    setCodeOpen(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [data.id]);

  /* panel change animation */
  const prevPanelRef = useState(currentPanel)[1];
  useEffect(() => {
    setPanelDir(
      currentPanel > (panelKey > 0 ? panelKey - 1 : 0) ? "left" : "right"
    );
    setPanelKey((k) => k + 1);
  }, [currentPanel]);

  /* ESC closes modals */
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setCodeOpen(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openAnim = (type) => {
    setAnimType(type);
    setModalOpen(true);
  };
  const openCode = (code) => {
    setActiveCode(code);
    setCodeOpen(true);
  };

  /* ── TITLE SLIDE ── */
  if (data.type === "title") {
    return (
      <div className={`slide slide-title-type ${animate ? "animate" : ""}`}>
        <div className="title-content">
          <h1 className="main-title">{data.title}</h1>
          {data.subtitle && <h2 className="subtitle">{data.subtitle}</h2>}
          {data.bullets && (
            <ul className="bullet-list title-bullets">
              {data.bullets.map((b, i) => (
                <li
                  key={i}
                  className="bullet-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="bullet-marker">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  /* ── QUIZ SLIDE ── */
  if (data.type === "quiz") {
    return (
      <div className={`slide slide-quiz-type ${animate ? "animate" : ""}`}>
        <Quiz questions={data.questions} lessonTitle={data.lessonTitle} />
      </div>
    );
  }

  /* ── determine what to render (panels vs flat) ── */
  const hasPanels = Array.isArray(data.panels) && data.panels.length > 0;
  const totalPanels = hasPanels ? data.panels.length : 1;
  const panel = hasPanels ? data.panels[currentPanel] : data;

  /* ── CONTENT SLIDE ── */
  return (
    <div className={`slide ${animate ? "animate" : ""}`}>
      <div className="slide-frame">
        {/* Title row */}
        <h2 className="slide-heading">{data.title}</h2>

        {/* 70 / 30 body */}
        <div className="slide-body">
          {/* ── RIGHT 70%: bullets / table / note ── */}
          <div className="slide-main" key={panelKey} data-dir={panelDir}>
            <AIInfo bullets={panel.bullets} />
            <ComparisonTable data={panel.comparison} />
            {panel.note && <div className="slide-note"> {panel.note}</div>}
          </div>

          {/* ── LEFT 30%: action buttons ── */}
          {(panel.animation || panel.code || data.animation || data.code) && (
            <div className="slide-actions">
              {(panel.animation || data.animation) && (
                <button
                  className="action-btn anim-btn"
                  onClick={() => openAnim(panel.animation || data.animation)}
                >
                  <span className="action-icon">🎬</span>
                  <span className="action-label">אנימציה</span>
                  <span className="action-sub">
                    {panel.animation === "eventloop" ||
                    data.animation === "eventloop"
                      ? "Event Loop"
                      : panel.animation === "heap" || data.animation === "heap"
                        ? "V8 Heap"
                        : panel.animation === "threadpool" ||
                            data.animation === "threadpool"
                          ? "Thread Pool"
                          : "הצג"}
                  </span>
                </button>
              )}
              {(panel.code || data.code) && (
                <button
                  className="action-btn code-btn"
                  onClick={() => openCode(panel.code || data.code)}
                >
                  <span className="action-icon">📄</span>
                  <span className="action-label">קוד</span>
                  <span className="action-sub">
                    {(panel.code || data.code).split("\n").length} שורות
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Panel navigation (if multi-panel slide) ── */}
        {hasPanels && (
          <div className="panel-nav">
            <button
              className="panel-arrow"
              onClick={onPrevPanel}
              disabled={currentPanel === 0}
            >
              ›
            </button>

            <div className="panel-dots">
              {data.panels.map((_, i) => (
                <span
                  key={i}
                  className={`panel-dot ${i === currentPanel ? "active" : ""}`}
                />
              ))}
            </div>

            <span className="panel-counter">
              {currentPanel + 1} / {totalPanels}
            </span>

            <button
              className="panel-arrow"
              onClick={onNextPanel}
              disabled={currentPanel === totalPanels - 1}
            >
              ‹
            </button>
          </div>
        )}
      </div>

      <AnimationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={animType}
      />
      <CodeModal
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
        code={activeCode}
        title={data.title}
      />
    </div>
  );
}

export default Slide;
