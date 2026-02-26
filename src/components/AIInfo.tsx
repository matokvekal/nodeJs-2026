import { useState } from "react";
import "./AIInfo.css";

interface AIInfoProps {
  bullets?: string[];
}

type ServiceType = "chatgpt" | "google" | "stackoverflow";

function AIInfo({ bullets }: AIInfoProps): JSX.Element | null {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [copiedRow, setCopiedRow] = useState<number | null>(null);

  if (!bullets || bullets.length === 0) return null;

  const copyText = (index: number, text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRow(index);
      setTimeout(() => setCopiedRow(null), 1500);
    });
  };

  const openService = (
    e: React.MouseEvent,
    service: ServiceType,
    text: string
  ): void => {
    e.stopPropagation();
    let url: string;
    if (service === "chatgpt") {
      url = `https://chatgpt.com/?q=${encodeURIComponent("מומחה לשפת NODE JS הסבר בקצרה ותן דוגמאות למפתחים" + text)}`;
    } else if (service === "google") {
      url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    } else {
      url = `https://stackoverflow.com/search?q=${encodeURIComponent(text)}`;
    }
    window.open(url, "_blank");
  };

  return (
    <ul className="ai-bullet-list">
      {bullets.map((b, i) => (
        <li
          key={i}
          className={`ai-bullet-item${hoveredRow === i ? " expanded" : ""}`}
          style={{ animationDelay: `${i * 0.08}s` }}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
        >
          <div
            className={`ai-bullet-row${copiedRow === i ? " copied" : ""}`}
            onClick={() => copyText(i, b)}
          >
            <span className="bullet-marker">▸</span>
            <span className="bullet-text">{b}</span>
            <span className="ai-arrow">
              {copiedRow === i ? "✓" : hoveredRow === i ? "⋯" : "➤"}
            </span>
          </div>
          <div className={`ai-service-panel${hoveredRow === i ? " visible" : ""}`}>
            <button
              className="ai-service-btn chatgpt-btn"
              onClick={(e) => openService(e, "chatgpt", b)}
              title="שאל את ChatGPT"
            >
              <span className="btn-icon">✦</span>
              ChatGPT
            </button>
            <button
              className="ai-service-btn google-btn"
              onClick={(e) => openService(e, "google", b)}
              title="חפש ב-Google"
            >
              <span className="btn-icon">G</span>
              Google
            </button>
            <button
              className="ai-service-btn so-btn"
              onClick={(e) => openService(e, "stackoverflow", b)}
              title="חפש ב-Stack Overflow"
            >
              <span className="btn-icon">⚡</span>
              Stack Overflow
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default AIInfo;
