import { useState, useEffect } from "react";
import Home from "./pages/Home";
import DayView from "./pages/DayView";
import Deck from "./components/Deck";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { courseData } from "./data/courseData";
import "./App.css";

function App() {
  const [route, setRoute] = useState({ view: "home" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState("winter");

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
  const goDay = (dayKey) => setRoute({ view: "day", dayKey });
  const goPresentation = (dayKey, presIndex) =>
    setRoute({ view: "presentation", dayKey, presIndex });

  if (route.view === "home") {
    return <Home courseData={courseData} onSelectDay={goDay} />;
  }

  if (route.view === "day") {
    const day = courseData[route.dayKey];
    return (
      <DayView
        day={day}
        dayKey={route.dayKey}
        onBack={goHome}
        onSelectPresentation={(i) => goPresentation(route.dayKey, i)}
      />
    );
  }

  if (route.view === "presentation") {
    const day = courseData[route.dayKey];
    const pres = day.presentations[route.presIndex];
    return (
      <div className="app">
        <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
        <button
          className="back-btn"
          onClick={() => goDay(route.dayKey)}
          title="חזור ליום"
        >
          ← חזור
        </button>
        <Deck slides={pres.slides} storageKey={pres.storageKey} />
        <button
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          title="לחץ F או כפתור זה למסך מלא"
        >
          ⛶
        </button>
      </div>
    );
  }

  return null;
}

export default App;
