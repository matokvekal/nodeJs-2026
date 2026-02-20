import "./ThemeSwitcher.css";

const themes = [
  { id: "winter", color: "#61dafb", label: "חורף" },
  { id: "spring", color: "#72e05a", label: "אביב" },
  { id: "summer", color: "#ffd166", label: "קיץ" },
  { id: "desert", color: "#e8865a", label: "מדבר" },
  { id: "purple", color: "#c39bd3", label: "סגול" },
];

function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div className="theme-switcher">
      {themes.map((t) => (
        <button
          key={t.id}
          className={`theme-dot ${currentTheme === t.id ? "active" : ""}`}
          style={{ "--dot-color": t.color }}
          onClick={() => onThemeChange(t.id)}
          title={t.label}
        />
      ))}
    </div>
  );
}

export default ThemeSwitcher;
