import "./ThemeSwitcher.css";

interface ColorTheme {
  id: string;
  color: string;
  label: string;
}

interface FontSize {
  id: string;
  scale: number;
  label: string;
  aRem: string;
}

interface ThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  bgMode: string;
  onBgModeChange: (mode: string) => void;
  fontScale: number;
  onFontScaleChange: (scale: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
}

const colorThemes: ColorTheme[] = [
  { id: "winter", color: "#61dafb", label: "חורף" },
  { id: "spring", color: "#72e05a", label: "אביב" },
  { id: "summer", color: "#ffd166", label: "קיץ" },
  { id: "desert", color: "#e8865a", label: "מדבר" },
  { id: "purple", color: "#c39bd3", label: "סגול" }
];

const fontSizes: FontSize[] = [
  { id: "xs", scale: 0.6, label: "-40%", aRem: "0.55rem" },
  { id: "sm", scale: 0.8, label: "-20%", aRem: "0.75rem" },
  { id: "lg", scale: 1.2, label: "+20%", aRem: "1.05rem" },
  { id: "xl", scale: 1.6, label: "+60%", aRem: "1.45rem" }
];

function ThemeSwitcher({
  currentTheme,
  onThemeChange,
  bgMode,
  onBgModeChange,
  fontScale,
  onFontScaleChange,
  isCollapsed = false,
  onToggleCollapse
}: ThemeSwitcherProps): JSX.Element {
  return (
    <div className={`theme-switcher ${isCollapsed ? "collapsed" : ""}`}>
      <img src="/logo.png" className="header-logo" alt="logo" />
      <button
        className="theme-toggle-btn"
        onClick={onToggleCollapse}
        title={isCollapsed ? "פתח הגדרות תצוגה" : "סגור הגדרות תצוגה"}
      >
        <span className="settings-icon">⚙️</span>
      </button>

      <div className="theme-controls">
        {colorThemes.map((t) => (
          <button
            key={t.id}
            className={`theme-dot ${currentTheme === t.id ? "active" : ""}`}
            style={{ "--dot-color": t.color } as React.CSSProperties}
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
            onClick={() =>
              onFontScaleChange(fontScale === f.scale ? 1.0 : f.scale)
            }
            title={f.label}
          >
            <span className="font-a" style={{ fontSize: f.aRem }}>
              {f.id === "xs" ? "a" : "A"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSwitcher;
