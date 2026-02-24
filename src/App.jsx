import { useState, useEffect } from "react";
import Home from "./pages/Home";
import DayView from "./pages/DayView";
import LecturerView from "./pages/LecturerView";
import Deck from "./components/Deck";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { courseData } from "./data/courseData";
import "./App.css";

function App() {
  const [route, setRoute] = useState({ view: "home" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState("winter");
  const [bgMode, setBgMode] = useState("dark");
  const [fontScale, setFontScale] = useState(1.0);
  const [isThemeSwitcherCollapsed, setIsThemeSwitcherCollapsed] =
    useState(true);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Apply background mode to root element
  useEffect(() => {
    if (bgMode === "dark") {
      document.documentElement.removeAttribute("data-bg");
    } else {
      document.documentElement.setAttribute("data-bg", bgMode);
    }
  }, [bgMode]);

  // Apply font scale to root element
  useEffect(() => {
    if (fontScale === 1.0) {
      document.documentElement.style.fontSize = "";
    } else {
      document.documentElement.style.fontSize = `${fontScale * 16}px`;
    }
  }, [fontScale]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === "f" || e.key === "F") && route.view === "presentation") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [route]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goHome = () => setRoute({ view: "home" });
  const goLecturer = () => setRoute({ view: "lecturer" });
  const goDay = (dayKey) => setRoute({ view: "day", dayKey });
  const goPresentation = (dayKey, presIndex) =>
    setRoute({ view: "presentation", dayKey, presIndex });

  return (
    <div className="app">
      <ThemeSwitcher
        currentTheme={theme}
        onThemeChange={setTheme}
        bgMode={bgMode}
        onBgModeChange={setBgMode}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        isCollapsed={isThemeSwitcherCollapsed}
        onToggleCollapse={() =>
          setIsThemeSwitcherCollapsed(!isThemeSwitcherCollapsed)
        }
      />

      {route.view === "home" && (
        <Home courseData={courseData} onSelectDay={goDay} onLecturerMode={goLecturer} />
      )}

      {route.view === "lecturer" && (
        <LecturerView courseData={courseData} onBack={goHome} />
      )}

      {route.view === "day" && (
        <DayView
          day={courseData[route.dayKey]}
          dayKey={route.dayKey}
          onBack={goHome}
          onSelectPresentation={(i) => goPresentation(route.dayKey, i)}
        />
      )}

      {route.view === "presentation" && (
        <>
          <button
            className="back-btn"
            onClick={() => goDay(route.dayKey)}
            title="חזור ליום"
          >
            ← חזור
          </button>
          <Deck
            slides={
              courseData[route.dayKey].presentations[route.presIndex].slides
            }
            storageKey={
              courseData[route.dayKey].presentations[route.presIndex].storageKey
            }
          />
          <button
            className="fullscreen-btn"
            onClick={toggleFullscreen}
            title="לחץ F או כפתור זה למסך מלא"
          >
            ⛶
          </button>
        </>
      )}
    </div>
  );
}

export default App;
