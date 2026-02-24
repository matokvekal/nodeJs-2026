import { useState } from "react";
import "./AIInfo.css";

function AIInfo({ bullets }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [copiedRow, setCopiedRow] = useState(null);

  if (!bullets || bullets.length === 0) return null;

  const toggleRow = (index, text) => {
    setExpandedRow(expandedRow === index ? null : index);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRow(index);
      setTimeout(() => setCopiedRow(null), 1500);
    });
  };

  const openService = (e, service, text) => {
    e.stopPropagation();
    let url;
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
          className={`ai-bullet-item${expandedRow === i ? " expanded" : ""}`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div
            className={`ai-bullet-row${copiedRow === i ? " copied" : ""}`}
            onClick={() => toggleRow(i, b)}
          >
            <span className="bullet-marker">▸</span>
            <span className="bullet-text">{b}</span>
            <span className="ai-arrow">
              {copiedRow === i ? "✓" : expandedRow === i ? "▼" : "➤"}
            </span>
          </div>
          {expandedRow === i && (
            <div className="ai-service-panel">
              <button
                className="ai-service-btn chatgpt-btn"
                onClick={(e) => openService(e, "chatgpt", b)}
              >
                ChatGPT
              </button>
              <button
                className="ai-service-btn google-btn"
                onClick={(e) => openService(e, "google", b)}
              >
                Google
              </button>
              <button
                className="ai-service-btn so-btn"
                onClick={(e) => openService(e, "stackoverflow", b)}
              >
                Stack Overflow
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default AIInfo;
