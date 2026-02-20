import "./ThemeSwitcher.css";

const colorThemes = [
  { id: "winter", color: "#61dafb", label: "חורף" },
  { id: "spring", color: "#72e05a", label: "אביב" },
  { id: "summer", color: "#ffd166", label: "קיץ" },
  { id: "desert", color: "#e8865a", label: "מדבר" },
  { id: "purple", color: "#c39bd3", label: "סגול" },
];

const fontSizes = [
  { id: "xs", scale: 0.6, label: "-40%", aRem: "0.55rem" },
  { id: "sm", scale: 0.8, label: "-20%", aRem: "0.75rem" },
  { id: "lg", scale: 1.2, label: "+20%", aRem: "1.05rem" },
  { id: "xl", scale: 1.6, label: "+60%", aRem: "1.45rem" },
];

function ThemeSwitcher({ currentTheme, onThemeChange, bgMode, onBgModeChange, fontScale, onFontScaleChange }) {
  return (
    <div className="theme-switcher">
      {colorThemes.map((t) => (
        <button
          key={t.id}
          className={`theme-dot ${currentTheme === t.id ? "active" : ""}`}
          style={{ "--dot-color": t.color }}
          onClick={() => onThemeChange(t.id)}
          title={t.label}
        />
      ))}

      <div className="theme-divider" />

      <button
        className={`bg-toggle ${bgMode !== "dark" ? "active" : ""}`}
        onClick={() => onBgModeChange(bgMode === "dark" ? "pearl" : "dark")}
        title={bgMode === "dark" ? "מצב בהיר" : "מצב כהה"}
      >
        {bgMode === "dark" ? "☀️" : "🌙"}
      </button>

      <div className="theme-divider" />

      {fontSizes.map((f) => (
        <button
          key={f.id}
          className={`font-size-btn ${fontScale === f.scale ? "active" : ""}`}
          onClick={() => onFontScaleChange(fontScale === f.scale ? 1.0 : f.scale)}
          title={f.label}
        >
          <span className="font-a" style={{ fontSize: f.aRem }}>{f.id === "xs" ? "a" : "A"}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
