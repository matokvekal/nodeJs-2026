import { useEffect, useRef, useState } from "react";
import "./HeapVisualization.css";

interface HeapObject {
  x: number;
  y: number;
  size: number;
  age: number;
  generation: "young" | "old";
  vx: number;
  vy: number;
  opacity: number;
}

interface HeapStats {
  youngGen: number;
  oldGen: number;
  total: number;
}

const HeapVisualization = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState<HeapStats>({
    youngGen: 30,
    oldGen: 45,
    total: 100
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr: number = window.devicePixelRatio || 1;

    canvas.width = 500 * dpr;
    canvas.height = 250 * dpr;
    canvas.style.width = "500px";
    canvas.style.height = "250px";
    ctx.scale(dpr, dpr);
    ctx.scale(0.625, 0.625);

    let frame: number = 0;
    let objects: HeapObject[] = [];

    const generateObjects = (): void => {
      objects = [];
      for (let i = 0; i < 30; i++) {
        objects.push({
          x: 50 + Math.random() * 300,
          y: 100 + Math.random() * 200,
          size: 8 + Math.random() * 12,
          age: Math.random() * 3,
          generation: "young",
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          opacity: 0.6 + Math.random() * 0.4
        });
      }
      for (let i = 0; i < 20; i++) {
        objects.push({
          x: 450 + Math.random() * 300,
          y: 100 + Math.random() * 200,
          size: 15 + Math.random() * 20,
          age: 10 + Math.random() * 20,
          generation: "old",
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          opacity: 0.8 + Math.random() * 0.2
        });
      }
    };

    generateObjects();

    const animate = (): void => {
      ctx.clearRect(0, 0, 800, 400);

      ctx.fillStyle = "rgba(97, 218, 251, 0.1)";
      ctx.fillRect(30, 80, 350, 250);
      ctx.strokeStyle = "#61dafb";
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 80, 350, 250);

      ctx.fillStyle = "rgba(168, 218, 220, 0.1)";
      ctx.fillRect(420, 80, 350, 250);
      ctx.strokeStyle = "#a8dadc";
      ctx.lineWidth = 2;
      ctx.strokeRect(420, 80, 350, 250);

      ctx.font = "bold 18px Assistant";
      ctx.fillStyle = "#61dafb";
      ctx.textAlign = "center";
      ctx.fillText("Young Generation", 205, 60);
      ctx.font = "12px Fira Code";
      ctx.fillText("(Short-lived objects)", 205, 75);

      ctx.font = "bold 18px Assistant";
      ctx.fillStyle = "#a8dadc";
      ctx.fillText("Old Generation", 595, 60);
      ctx.font = "12px Fira Code";
      ctx.fillText("(Long-lived objects)", 595, 75);

      objects.forEach((obj, index) => {
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.age += 0.01;

        const minX = obj.generation === "young" ? 30 : 420;
        const maxX = obj.generation === "young" ? 380 : 770;
        if (obj.x < minX || obj.x > maxX) obj.vx *= -1;
        if (obj.y < 80 || obj.y > 330) obj.vy *= -1;
        obj.x = Math.max(minX, Math.min(maxX, obj.x));
        obj.y = Math.max(80, Math.min(330, obj.y));

        if (obj.generation === "young" && obj.age > 5) {
          obj.generation = "old";
          obj.x = 450 + Math.random() * 300;
          obj.size *= 1.5;
          obj.opacity = 0.8;
        }

        const pulse =
          obj.generation === "young"
            ? 1 + Math.sin(frame * 0.1 + index) * 0.1
            : 1;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size * pulse, 0, Math.PI * 2);

        const gradient = ctx.createRadialGradient(
          obj.x,
          obj.y,
          0,
          obj.x,
          obj.y,
          obj.size * pulse
        );
        if (obj.generation === "young") {
          gradient.addColorStop(0, `rgba(97, 218, 251, ${obj.opacity})`);
          gradient.addColorStop(1, `rgba(97, 218, 251, 0.1)`);
        } else {
          gradient.addColorStop(0, `rgba(168, 218, 220, ${obj.opacity})`);
          gradient.addColorStop(1, `rgba(168, 218, 220, 0.1)`);
        }
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = obj.generation === "young" ? "#61dafb" : "#a8dadc";
        ctx.lineWidth = 1;
        ctx.stroke();

        if (obj.generation === "young" && obj.age > 3) {
          ctx.fillStyle = "#f39c12";
          ctx.font = "bold 10px Fira Code";
          ctx.textAlign = "center";
          ctx.fillText("→", obj.x, obj.y + 3);
        }
      });

      if (frame % 200 === 0) {
        objects = objects.filter(
          (obj) => !(obj.generation === "young" && Math.random() > 0.7)
        );
        for (let i = 0; i < 5; i++) {
          objects.push({
            x: 50 + Math.random() * 300,
            y: 100 + Math.random() * 200,
            size: 8 + Math.random() * 12,
            age: 0,
            generation: "young",
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: 0.6 + Math.random() * 0.4
          });
        }
      }

      if (frame % 200 < 10) {
        ctx.fillStyle = "rgba(255, 107, 107, 0.2)";
        ctx.fillRect(0, 0, 800, 400);
        ctx.font = "bold 24px Assistant";
        ctx.fillStyle = "#ff6b6b";
        ctx.textAlign = "center";
        ctx.fillText("⚡ Garbage Collection", 400, 35);
      }

      setStats({
        youngGen: objects.filter((o) => o.generation === "young").length,
        oldGen: objects.filter((o) => o.generation === "old").length,
        total: objects.length
      });

      frame++;
      requestAnimationFrame(animate);
    };

    const animationId: number = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="heap-visualization">
      <div className="animation-header">
        <h3>🧠 V8 Heap Memory - ניהול זיכרון חכם</h3>
        <p>
          V8 מחלק את הזיכרון לדורות (Generations) כדי לייעל Garbage Collection.
        </p>
      </div>

      <div className="heap-main-row">
        <canvas ref={canvasRef} className="heap-canvas" />

        <div className="heap-side">
          <div className="heap-stats">
            <div className="stat-item young">
              <span className="stat-label">Young Gen:</span>
              <span className="stat-value">{stats.youngGen} objects</span>
            </div>
            <div className="stat-item old">
              <span className="stat-label">Old Gen:</span>
              <span className="stat-value">{stats.oldGen} objects</span>
            </div>
            <div className="stat-item total">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.total} objects</span>
            </div>
          </div>

          <div className="concept-explanation">
            <div className="concept-item">
              <span className="concept-icon" style={{ color: "#61dafb" }}>
                🆕
              </span>
              <div>
                <strong>Young Generation (2MB)</strong>
                <p>אובייקטים חדשים. רוב נמחקים מהר (Scavenge GC - מהיר מאוד)</p>
              </div>
            </div>
            <div className="concept-item">
              <span className="concept-icon" style={{ color: "#a8dadc" }}>
                👴
              </span>
              <div>
                <strong>Old Generation (1GB+)</strong>
                <p>
                  אובייקטים ששרדו מספר GC cycles. נמחקים בהדרגה (Mark-Sweep -
                  איטי יותר)
                </p>
              </div>
            </div>
            <div className="concept-item">
              <span className="concept-icon" style={{ color: "#ff6b6b" }}>
                🗑️
              </span>
              <div>
                <strong>Garbage Collection</strong>
                <p>
                  מזהה ומוחק אוטומטית אובייקטים שאין להם הפניות (references)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualization;
