import { useEffect, useRef, useState } from "react";
import "./ThreadPoolAnimation.css";

const ThreadPoolAnimation = () => {
  const canvasRef = useRef(null);
  const [poolSize] = useState(4);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 800 * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = "800px";
    canvas.style.height = "400px";
    ctx.scale(dpr, dpr);

    let threads = Array.from({ length: poolSize }, (_, i) => ({
      id: i,
      x: 100 + i * 150,
      y: 200,
      busy: false,
      currentTask: null,
      progress: 0
    }));
    let taskQueue = [];
    let completedTasks = [];
    let nextTaskId = 1;
    let frame = 0;

    const addTask = () => {
      if (taskQueue.length + threads.filter((t) => t.busy).length < 8) {
        taskQueue.push({
          id: nextTaskId++,
          x: 50,
          y: 50,
          targetThread: null,
          progress: 0,
          duration: 100 + Math.random() * 100,
          status: "waiting"
        });
      }
    };

    for (let i = 0; i < 6; i++) setTimeout(() => addTask(), i * 300);
    const taskInterval = setInterval(addTask, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, 800, 400);

      ctx.font = "bold 18px Assistant";
      ctx.fillStyle = "#61dafb";
      ctx.textAlign = "center";
      ctx.fillText(`Thread Pool (${poolSize} threads)`, 400, 30);

      ctx.fillStyle = "rgba(97, 218, 251, 0.1)";
      ctx.fillRect(20, 50, 760, 80);
      ctx.strokeStyle = "#61dafb";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 50, 760, 80);

      ctx.font = "14px Assistant";
      ctx.fillStyle = "#a8dadc";
      ctx.textAlign = "left";
      ctx.fillText("Task Queue:", 30, 70);

      taskQueue.forEach((task, index) => {
        const taskX = 150 + index * 80;
        ctx.beginPath();
        ctx.rect(taskX, 90, 60, 30);
        ctx.fillStyle = "#f39c12";
        ctx.fill();
        ctx.strokeStyle = "#e67e22";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "12px Fira Code";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`T${task.id}`, taskX + 30, 110);
      });

      threads.forEach((thread) => {
        if (!thread.busy && taskQueue.length > 0) {
          thread.currentTask = taskQueue.shift();
          thread.currentTask.status = "processing";
          thread.currentTask.targetThread = thread.id;
          thread.busy = true;
          thread.progress = 0;
        }
      });

      threads.forEach((thread) => {
        const x = thread.x;
        const y = thread.y;
        const pulse = thread.busy ? 1 + Math.sin(frame * 0.1) * 0.05 : 1;

        ctx.beginPath();
        ctx.arc(x, y, 40 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = thread.busy
          ? "rgba(97, 218, 251, 0.3)"
          : "rgba(127, 163, 176, 0.2)";
        ctx.fill();
        ctx.strokeStyle = thread.busy ? "#61dafb" : "#7fa3b0";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = "bold 14px Assistant";
        ctx.fillStyle = thread.busy ? "#61dafb" : "#7fa3b0";
        ctx.textAlign = "center";
        ctx.fillText(`Thread ${thread.id + 1}`, x, y - 60);

        ctx.font = "11px Fira Code";
        ctx.fillStyle = thread.busy ? "#4ecdc4" : "#95a5a6";
        ctx.fillText(thread.busy ? "BUSY" : "IDLE", x, y + 60);

        if (thread.busy && thread.currentTask) {
          thread.progress += 1;
          ctx.beginPath();
          ctx.rect(x - 25, y - 15, 50, 30);
          ctx.fillStyle = "#4ecdc4";
          ctx.fill();
          ctx.strokeStyle = "#3da89d";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.font = "bold 12px Fira Code";
          ctx.fillStyle = "#fff";
          ctx.fillText(`T${thread.currentTask.id}`, x, y + 5);

          const progressPercent = thread.progress / thread.currentTask.duration;
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(x - 25, y + 20, 50, 4);
          ctx.fillStyle = "#00d9ff";
          ctx.fillRect(x - 25, y + 20, 50 * progressPercent, 4);

          if (thread.progress >= thread.currentTask.duration) {
            completedTasks.push(thread.currentTask);
            thread.currentTask = null;
            thread.busy = false;
            thread.progress = 0;
          }
        }
      });

      ctx.fillStyle = "rgba(78, 205, 196, 0.1)";
      ctx.fillRect(20, 310, 760, 70);
      ctx.strokeStyle = "#4ecdc4";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 310, 760, 70);

      ctx.font = "14px Assistant";
      ctx.fillStyle = "#4ecdc4";
      ctx.textAlign = "left";
      ctx.fillText(`Completed (${completedTasks.length}):`, 30, 330);

      completedTasks.slice(-8).forEach((task, index) => {
        const taskX = 150 + index * 80;
        ctx.beginPath();
        ctx.rect(taskX, 340, 60, 30);
        ctx.fillStyle = "#4ecdc4";
        ctx.fill();
        ctx.strokeStyle = "#3da89d";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "12px Fira Code";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`T${task.id}`, taskX + 30, 360);
      });

      setTasks({
        waiting: taskQueue.length,
        processing: threads.filter((t) => t.busy).length,
        completed: completedTasks.length
      });
      frame++;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(taskInterval);
    };
  }, [poolSize]);

  return (
    <div className="thread-pool-container">
      <div className="animation-header">
        <h3>🧵 Thread Pool - עיבוד מקביל</h3>
        <p>
          Node.js משתמש ב-4 threads (ברירת מחדל) לפעולות blocking שה-OS לא תומך
          בהן אסינכרונית.
        </p>
      </div>

      <canvas ref={canvasRef} className="thread-pool-canvas" />

      <div className="thread-stats">
        <div className="thread-stat waiting">
          <span className="stat-label">Waiting</span>
          <span className="stat-value">{tasks.waiting || 0}</span>
        </div>
        <div className="thread-stat processing">
          <span className="stat-label">Processing</span>
          <span className="stat-value">{tasks.processing || 0}</span>
        </div>
        <div className="thread-stat completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{tasks.completed || 0}</span>
        </div>
      </div>

      <div className="concept-explanation">
        <div className="concept-item">
          <span className="concept-icon" style={{ color: "#f39c12" }}>
            📥
          </span>
          <div>
            <strong>Task Queue</strong>
            <p>משימות ממתינות לטיפול. כל משימה תיקח thread פנוי כשיהיה זמין</p>
          </div>
        </div>
        <div className="concept-item">
          <span className="concept-icon" style={{ color: "#61dafb" }}>
            ⚙️
          </span>
          <div>
            <strong>Worker Threads</strong>
            <p>
              מבצעים: crypto.pbkdf2, fs, dns.lookup, zlib. ניתן לשנות עם
              UV_THREADPOOL_SIZE
            </p>
          </div>
        </div>
        <div className="concept-item">
          <span className="concept-icon" style={{ color: "#4ecdc4" }}></span>
          <div>
            <strong>למה Thread Pool?</strong>
            <p>מאפשר פעולות blocking מבלי לחסום את Event Loop הראשי</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadPoolAnimation;
