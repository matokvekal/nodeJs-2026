import { useState, useEffect } from "react";
import Slide from "./Slide";
import Progress from "./Progress";
import type { Slide as SlideType } from "../types";
import "./Deck.css";

interface DeckProps {
  slides: SlideType[];
  storageKey?: string;
  presIndex?: number;
}

function Deck({
  slides,
  storageKey = "presentation-current-slide",
  presIndex = 0
}: DeckProps): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    const saved: string | null = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    const completionKey: string = `${storageKey}-completed`;
    return localStorage.getItem(completionKey) === "true";
  });

  const totalSlides: number = slides.length;

  const getPanelCount = (slideIndex: number): number => {
    const s = slides[slideIndex] as any;
    return s.panels ? s.panels.length : 1;
  };

  // Reset panel on slide change
  useEffect(() => {
    setCurrentPanel(0);
  }, [currentSlide]);

  useEffect(() => {
    localStorage.setItem(storageKey, currentSlide.toString());
  }, [currentSlide, storageKey]);

  const handleCompletionToggle = (): void => {
    const completionKey: string = `${storageKey}-completed`;
    const newValue: boolean = !isCompleted;
    setIsCompleted(newValue);
    localStorage.setItem(completionKey, newValue.toString());
  };

  // Navigation helpers
  const goNext = (): void => {
    const total: number = getPanelCount(currentSlide);
    if (currentPanel < total - 1) {
      setCurrentPanel((p) => p + 1);
    } else if (currentSlide < totalSlides - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const goPrev = (): void => {
    if (currentPanel > 0) {
      setCurrentPanel((p) => p - 1);
    } else if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const isFirst: boolean = currentSlide === 0 && currentPanel === 0;
  const isLast: boolean =
    currentSlide === totalSlides - 1 &&
    currentPanel === getPanelCount(currentSlide) - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goNext();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goPrev();
      } else if (e.key === "Home") {
        setCurrentSlide(0);
        setCurrentPanel(0);
      } else if (e.key === "End") {
        const last: number = totalSlides - 1;
        setCurrentSlide(last);
        setCurrentPanel(getPanelCount(last) - 1);
      }
    };

    const handleWheel = (e: WheelEvent): void => {
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
        data={slides[currentSlide] as any}
        currentPanel={currentPanel}
        onNextPanel={() => setCurrentPanel((p) => p + 1)}
        onPrevPanel={() => setCurrentPanel((p) => p - 1)}
        presIndex={presIndex}
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
