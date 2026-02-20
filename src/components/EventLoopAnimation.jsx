import { useEffect, useRef, useState } from "react";
import "./EventLoopAnimation.css";

const EventLoopAnimation = () => {
  const canvasRef = useRef(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const phases = [
    { name: "Timers", color: "#ff6b6b", items: ["setTimeout", "setInterval"] },
    { name: "I/O Callbacks", color: "#4ecdc4", items: ["TCP", "UDP"] },
    { name: "Idle", color: "#95a5a6", items: ["Internal"] },
    { name: "Poll", color: "#f39c12", items: ["I/O Events"] },
    { name: "Check", color: "#9b59b6", items: ["setImmediate"] },
    { name: "Close", color: "#e74c3c", items: ["socket.close()"] }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = "800px";
    canvas.style.height = "600px";
    ctx.scale(dpr, dpr);

    let animationFrame = 0;
    const centerX = 400;
    const centerY = 300;
    const radius = 180;
    const microtaskRadius = 80;

    const animate = () => {
      ctx.clearRect(0, 0, 800, 600);

      const elapsed = Date.now() - startTimeRef.current;
      const phaseIndex = Math.floor((elapsed / 2000) % phases.length);
      setCurrentPhase(phaseIndex);

      ctx.beginPath();
      ctx.arc(centerX, centerY, microtaskRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(97, 218, 251, 0.2)";
      ctx.fill();
      ctx.strokeStyle = "#61dafb";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#61dafb";
      ctx.font = "bold 16px Assistant";
      ctx.textAlign = "center";
      ctx.fillText("Microtasks", centerX, centerY - 20);
      ctx.font = "12px Fira Code";
      ctx.fillText("Promise.then", centerX, centerY);
      ctx.fillText("nextTick", centerX, centerY + 20);

      phases.forEach((phase, index) => {
        const angle = (index / phases.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const isActive = index === phaseIndex;
        const pulseScale = isActive
          ? 1 + Math.sin(animationFrame * 0.1) * 0.1
          : 1;

        ctx.save();
        ctx.translate(x, y);

        ctx.beginPath();
        ctx.arc(0, 0, 50 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? phase.color : phase.color + "40";
        ctx.fill();
        ctx.strokeStyle = isActive ? "#fff" : phase.color;
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();

        ctx.fillStyle = isActive ? "#fff" : "#a8dadc";
        ctx.font = `bold ${isActive ? 14 : 12}px Assistant`;
        ctx.textAlign = "center";
        ctx.fillText(phase.name, 0, -15);

        ctx.font = "10px Fira Code";
        phase.items.forEach((item, i) => {
          ctx.fillText(item, 0, 5 + i * 15);
        });

        ctx.restore();

        const nextIndex = (index + 1) % phases.length;
        const nextAngle =
          (nextIndex / phases.length) * Math.PI * 2 - Math.PI / 2;
        const currentX = centerX + Math.cos(angle) * radius;
        const currentY = centerY + Math.sin(angle) * radius;
        const nextX = centerX + Math.cos(nextAngle) * radius;
        const nextY = centerY + Math.sin(nextAngle) * radius;

        const startArrowX = currentX + Math.cos(angle) * 55;
        const startArrowY = currentY + Math.sin(angle) * 55;
        const endArrowX = nextX - Math.cos(nextAngle) * 55;
        const endArrowY = nextY - Math.sin(nextAngle) * 55;

        const midAngle = (angle + nextAngle) / 2;
        const curveDist = radius + 30;
        const controlX = centerX + Math.cos(midAngle) * curveDist;
        const controlY = centerY + Math.sin(midAngle) * curveDist;

        ctx.beginPath();
        ctx.moveTo(startArrowX, startArrowY);
        ctx.quadraticCurveTo(controlX, controlY, endArrowX, endArrowY);
        ctx.strokeStyle = isActive ? phase.color : "rgba(168, 218, 220, 0.2)";
        ctx.lineWidth = isActive ? 4 : 2;
        ctx.stroke();

        const arrowAngle = Math.atan2(
          endArrowY - controlY,
          endArrowX - controlX
        );
        ctx.save();
        ctx.translate(endArrowX, endArrowY);
        ctx.rotate(arrowAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-12, -6);
        ctx.lineTo(-12, 6);
        ctx.closePath();
        ctx.fillStyle = isActive ? phase.color : "rgba(168, 218, 220, 0.3)";
        ctx.fill();
        ctx.restore();
      });

      const indicatorAngle = (animationFrame * 0.02) % (Math.PI * 2);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(indicatorAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius - 40, 0);
      ctx.strokeStyle = "#00d9ff";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      animationFrame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const phaseDescriptions = {
    Timers: "מריץ callbacks של setTimeout ו-setInterval שזמנם הגיע",
    "I/O Callbacks": "טיפול בשגיאות I/O וקריאות חוזרות מהסבב הקודם",
    Idle: "שימוש פנימי של Node.js בלבד",
    Poll: "מחכה לאירועי I/O חדשים - כאן נעשית רוב העבודה",
    Check: "מריץ callbacks של setImmediate",
    Close: "סגירת connections ומשאבים (socket.close)"
  };

  return (
    <div className="event-loop-container">
      <div className="animation-header">
        <h3>🔄 Event Loop - לב פועם של Node.js</h3>
        <p>
          ה-Event Loop עובר בצורה מחזורית דרך 6 שלבים. בכל שלב מטפל ב-callbacks
          ספציפיים.
        </p>
      </div>

      <canvas ref={canvasRef} className="event-loop-canvas" />

      <div className="phase-indicator">
        <span className="phase-label">שלב נוכחי:</span>
        <span
          className="phase-name"
          style={{ color: phases[currentPhase].color }}
        >
          {phases[currentPhase].name}
        </span>
      </div>

      <div className="phase-description">
        {phaseDescriptions[phases[currentPhase].name]}
      </div>

      <div className="concept-explanation">
        <div className="concept-item">
          <span className="concept-icon">⏱️</span>
          <div>
            <strong>Macrotasks</strong>
            <p>מבוצעים בשלבים שונים: setTimeout, setImmediate, I/O</p>
          </div>
        </div>
        <div className="concept-item">
          <span className="concept-icon">⚡</span>
          <div>
            <strong>Microtasks (מרכז)</strong>
            <p>
              רצים מיד אחרי כל callback לפני המשך ה-Loop: Promise.then, nextTick
            </p>
          </div>
        </div>
        <div className="concept-item">
          <span className="concept-icon">🔁</span>
          <div>
            <strong>זרימה מחזורית</strong>
            <p>ה-Loop עובר מ-Timers → I/O → Poll → Check → Close ושוב מתחיל</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLoopAnimation;
