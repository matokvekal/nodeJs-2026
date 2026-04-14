import { useEffect, useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ExercisesModal.css";

interface FileData {
  name: string;
  content: string;
  path: string;
}

interface ExercisesModalProps {
  presId: string;
  presTitle: string;
  onClose: () => void;
}

// Load ALL lesson JS files at build time via Vite glob (Vite 5 syntax)
const allFiles: Record<string, string> = import.meta.glob(
  "/nodejs-lessons/**/*.js",
  {
    query: "?raw",
    import: "default",
    eager: true
  }
);
console.log("[ExercisesModal] allFiles keys:", Object.keys(allFiles));

function presIdToFolder(presId: string): string {
  const [day, lesson] = presId.split("_");
  return `day${day}_lesson${lesson}`;
}

function getFilesForLesson(presId: string): FileData[] {
  const folder: string = presIdToFolder(presId);
  const prefix: string = `/nodejs-lessons/${folder}/`;
  console.log("[ExercisesModal] presId:", presId, "→ prefix:", prefix);
  console.log(
    "[ExercisesModal] all keys sample:",
    Object.keys(allFiles).slice(0, 5)
  );
  const matched: string[] = Object.keys(allFiles).filter((p) =>
    p.startsWith(prefix)
  );
  console.log("[ExercisesModal] matched:", matched);

  return Object.entries(allFiles)
    .filter(([path]) => {
      if (!path.startsWith(prefix)) return false;
      const rest: string = path.slice(prefix.length);
      return rest.endsWith(".js") && !rest.includes("/"); // top-level only
    })
    .sort(([a], [b]) => {
      const nameA: string = a.split("/").pop()!.replace(".js", "");
      const nameB: string = b.split("/").pop()!.replace(".js", "");
      const numA: number = parseInt(nameA);
      const numB: number = parseInt(nameB);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      if (!isNaN(numA)) return -1;
      if (!isNaN(numB)) return 1;
      return nameA.localeCompare(nameB);
    })
    .map(([path, content]) => ({
      name: path.split("/").pop()!,
      content: content as string,
      path
    }));
}

function ExercisesModal({
  presId,
  presTitle,
  onClose
}: ExercisesModalProps): JSX.Element {
  const files: FileData[] = useMemo(() => getFilesForLesson(presId), [presId]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setActiveIdx(0);
  }, [presId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        setActiveIdx((i) => (i + 1) % files.length);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        setActiveIdx((i) => (i - 1 + files.length) % files.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, files.length]);

  const current: FileData | undefined = files[activeIdx];

  const handleCopy = (): void => {
    navigator.clipboard.writeText(current?.content || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="ex-overlay" onClick={onClose}>
      <div
        className="ex-modal"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ex-header">
          <div className="ex-header-left">
            <span className="ex-header-icon">📁</span>
            <span className="ex-header-title">תרגילים — {presTitle}</span>
            <span className="ex-header-count">{files.length} קבצים</span>
          </div>
          <div className="ex-header-right">
            <button
              className={`ex-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              title="העתק קוד"
            >
              {copied ? "✓ הועתק" : "⎘ העתק"}
            </button>
            <button
              className="ex-close-btn"
              onClick={onClose}
              title="סגור (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="ex-body">
          {/* File list */}
          <div className="ex-file-list">
            {files.map((file, idx) => (
              <button
                key={file.path}
                className={`ex-file-btn ${idx === activeIdx ? "active" : ""}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="ex-file-badge">JS</span>
                <span className="ex-file-name">{file.name}</span>
              </button>
            ))}
            {files.length === 0 && <p className="ex-empty">אין קבצים</p>}
          </div>

          {/* Code viewer */}
          <div className="ex-code-pane">
            {current ? (
              <>
                <div className="ex-code-bar">
                  <span className="ex-code-filename">{current.name}</span>
                  <span className="ex-code-nav">
                    {activeIdx + 1} / {files.length}
                  </span>
                </div>
                <div className="ex-code-scroll">
                  <SyntaxHighlighter
                    language="javascript"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "20px 24px",
                      background: "transparent",
                      fontSize: "0.87rem",
                      lineHeight: "1.7",
                      direction: "ltr",
                      textAlign: "left",
                      minHeight: "100%"
                    }}
                    showLineNumbers
                    lineNumberStyle={{
                      color: "#3d4f60",
                      minWidth: "2.5em",
                      paddingRight: "1em"
                    }}
                  >
                    {current.content}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <p className="ex-empty">אין תוכן</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="ex-footer">
          ESC לסגירה &nbsp;·&nbsp; ↑ ↓ לניווט בין קבצים
        </div>
      </div>
    </div>
  );
}

export default ExercisesModal;
