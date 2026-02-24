import { useState, useEffect } from "react";
import Slide from "./Slide";
import Progress from "./Progress";
import "./Deck.css";

function Deck({ slides, storageKey = "presentation-current-slide" }) {
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isCompleted, setIsCompleted] = useState(() => {
    const completionKey = `${storageKey}-completed`;
    return localStorage.getItem(completionKey) === "true";
  });

  const totalSlides = slides.length;

  const getPanelCount = (slideIndex) => {
    const s = slides[slideIndex];
    return s.panels ? s.panels.length : 1;
  };

  // Reset panel on slide change
  useEffect(() => {
    setCurrentPanel(0);
  }, [currentSlide]);

  useEffect(() => {
    localStorage.setItem(storageKey, currentSlide);
  }, [currentSlide, storageKey]);

  const handleCompletionToggle = () => {
    const completionKey = `${storageKey}-completed`;
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    localStorage.setItem(completionKey, newValue.toString());
  };

  // Navigation helpers
  const goNext = () => {
    const total = getPanelCount(currentSlide);
    if (currentPanel < total - 1) {
      setCurrentPanel((p) => p + 1);
    } else if (currentSlide < totalSlides - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentPanel > 0) {
      setCurrentPanel((p) => p - 1);
    } else if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const isFirst = currentSlide === 0 && currentPanel === 0;
  const isLast =
    currentSlide === totalSlides - 1 &&
    currentPanel === getPanelCount(currentSlide) - 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goNext();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goPrev();
      } else if (e.key === "Home") {
        setCurrentSlide(0);
        setCurrentPanel(0);
      } else if (e.key === "End") {
        const last = totalSlides - 1;
        setCurrentSlide(last);
        setCurrentPanel(getPanelCount(last) - 1);
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSlide, currentPanel, totalSlides]);

  return (
    <div className="deck">
      <Slide
        data={slides[currentSlide]}
        currentPanel={currentPanel}
        onNextPanel={() => setCurrentPanel((p) => p + 1)}
        onPrevPanel={() => setCurrentPanel((p) => p - 1)}
      />

      <div className="navigation">
        <button
          onClick={() => {
            setCurrentSlide(0);
            setCurrentPanel(0);
          }}
          disabled={isFirst}
          className="nav-btn start-btn"
          title="חזור לתחילה"
        >
          ⟳
        </button>
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="nav-btn"
          title="קודם"
        >
          →
        </button>
        <span className="slide-counter">
          {currentSlide + 1} / {totalSlides}
        </span>
        <button
          onClick={goNext}
          disabled={isLast}
          className="nav-btn"
          title="הבא"
        >
          ←
        </button>
      </div>

      {isLast && (
        <div className="completion-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleCompletionToggle}
            />
            <span>Done </span>
          </label>
        </div>
      )}

      <Progress current={currentSlide + 1} total={totalSlides} />
    </div>
  );
}

export default Deck;
