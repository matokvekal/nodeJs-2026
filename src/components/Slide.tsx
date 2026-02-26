import { useEffect, useState } from "react";
import AnimationModal from "./AnimationModal";
import CodeModal from "./CodeModal";
import Quiz from "./Quiz";
import AIInfo from "./AIInfo";
import type { Quiz as QuizType } from "../types";
import "./Slide.css";

interface ComparisonData {
  headers: string[];
  rows: string[][];
}

interface SlidePanel {
  bullets?: string[];
  comparison?: ComparisonData;
  note?: string;
  animation?: string;
  code?: string;
}

interface SlideData {
  id: number | string;
  type?: "title" | "quiz" | "content";
  title?: string;
  subtitle?: string;
  bullets?: string[];
  questions?: QuizType;
  lessonTitle?: string;
  panels?: SlidePanel[];
  animation?: string;
  code?: string;
}

interface SlideProps {
  data: SlideData;
  currentPanel: number;
  onNextPanel: () => void;
  onPrevPanel: () => void;
  presIndex?: number;
}

interface BulletListProps {
  bullets?: string[];
}

interface ComparisonTableProps {
  data?: ComparisonData;
}

/* ── helpers ── */
function BulletList({ bullets }: BulletListProps): JSX.Element | null {
  if (!bullets) return null;
  return (
    <ul className="bullet-list">
      {bullets.map((b, i) => (
        <li
          key={i}
          className="bullet-item"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <span className="bullet-marker">▸</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonTable({ data }: ComparisonTableProps): JSX.Element | null {
  if (!data) return null;
  return (
    <div className="comparison-table">
      <table>
        <thead>
          <tr>
            {data.headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── hex grid background ── */
// Tile size (w × h) and optional rotation vary per presentation
const HEX_TILES = [
  { w: 69.28, h: 120, rotate: 0  },   // 0: standard
  { w: 48.5,  h: 84,  rotate: 0  },   // 1: dense/small
  { w: 95.26, h: 165, rotate: 0  },   // 2: large/sparse
  { w: 69.28, h: 120, rotate: 30 },   // 3: rotated 30° (diamond feel)
];

function HexBg({ variant = 0 }: { variant?: number }): JSX.Element {
  const tile = HEX_TILES[variant] ?? HEX_TILES[0];
  const r  = tile.h / 3;        // circumradius
  const hw = tile.w / 2;        // half-width = r*√3/2

  const pts = (cx: number, cy: number): string =>
    `${cx},${cy - r} ${cx + hw},${cy - r / 2} ${cx + hw},${cy + r / 2} ` +
    `${cx},${cy + r} ${cx - hw},${cy + r / 2} ${cx - hw},${cy - r / 2}`;

  const xfm = tile.rotate ? `rotate(${tile.rotate})` : undefined;

  return (
    <div className="hex-bg" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hxg"
            x="0" y="0"
            width={tile.w} height={tile.h}
            patternUnits="userSpaceOnUse"
            patternTransform={xfm}
          >
            <polygon points={pts(hw, r)}            fill="none" stroke="currentColor" strokeWidth="0.7" />
            <polygon points={pts(0,  r * 2.5)}      fill="none" stroke="currentColor" strokeWidth="0.7" />
            <polygon points={pts(tile.w, r * 2.5)}  fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hxg)" />
      </svg>
    </div>
  );
}

/* ── floating glow particles ── */
// Each variant has a unique particle layout
const PTCL_SETS = [
  // 0: balanced scatter both sides
  [
    { x: "2%",  y: "16%", s: 3,   d: 0   },
    { x: "6%",  y: "38%", s: 2,   d: 0.7 },
    { x: "3%",  y: "62%", s: 1.5, d: 1.5 },
    { x: "9%",  y: "80%", s: 2.5, d: 2.4 },
    { x: "11%", y: "48%", s: 1,   d: 1.1 },
    { x: "93%", y: "22%", s: 2.5, d: 1.0 },
    { x: "97%", y: "44%", s: 2,   d: 1.8 },
    { x: "91%", y: "70%", s: 3,   d: 0.2 },
    { x: "95%", y: "84%", s: 1.5, d: 2.1 },
    { x: "88%", y: "35%", s: 1,   d: 1.4 },
  ],
  // 1: many small particles clustered at top
  [
    { x: "3%",  y: "10%", s: 2,   d: 0   },
    { x: "7%",  y: "22%", s: 1.5, d: 0.3 },
    { x: "4%",  y: "34%", s: 2.5, d: 0.8 },
    { x: "10%", y: "14%", s: 1,   d: 1.2 },
    { x: "2%",  y: "46%", s: 2,   d: 0.5 },
    { x: "8%",  y: "56%", s: 1.5, d: 1.8 },
    { x: "94%", y: "12%", s: 2,   d: 0.2 },
    { x: "97%", y: "26%", s: 1.5, d: 0.9 },
    { x: "91%", y: "40%", s: 2.5, d: 1.5 },
    { x: "96%", y: "52%", s: 1,   d: 0.6 },
    { x: "88%", y: "18%", s: 2,   d: 2.0 },
    { x: "93%", y: "64%", s: 1.5, d: 1.1 },
  ],
  // 2: few large particles spread along full height
  [
    { x: "4%",  y: "12%", s: 4,   d: 0   },
    { x: "3%",  y: "50%", s: 3.5, d: 1.5 },
    { x: "7%",  y: "86%", s: 4,   d: 0.8 },
    { x: "96%", y: "20%", s: 3.5, d: 0.4 },
    { x: "93%", y: "58%", s: 4,   d: 1.9 },
    { x: "97%", y: "78%", s: 3,   d: 0.7 },
  ],
  // 3: symmetric mirror pairs at same heights
  [
    { x: "3%",  y: "20%", s: 2.5, d: 0   },
    { x: "97%", y: "20%", s: 2.5, d: 0   },
    { x: "3%",  y: "45%", s: 2,   d: 1.0 },
    { x: "97%", y: "45%", s: 2,   d: 1.0 },
    { x: "3%",  y: "70%", s: 3,   d: 2.0 },
    { x: "97%", y: "70%", s: 3,   d: 2.0 },
    { x: "8%",  y: "33%", s: 1.5, d: 0.5 },
    { x: "92%", y: "33%", s: 1.5, d: 0.5 },
    { x: "8%",  y: "58%", s: 1.5, d: 1.5 },
    { x: "92%", y: "58%", s: 1.5, d: 1.5 },
  ],
];

function FloatingParticles({ variant = 0 }: { variant?: number }): JSX.Element {
  const ptcls = PTCL_SETS[variant] ?? PTCL_SETS[0];
  return (
    <>
      {ptcls.map((p, i) => (
        <span
          key={i}
          className="f-particle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.s}px`,
            height: `${p.s}px`,
            animationDelay: `${p.d}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

/* ── hi-tech circuit side decoration ── */
// Each variant = different circuit layout + scan speed per presentation (1-4)
const CIRCUIT_VARIANTS = [
  // ── Variant 0: evenly-spaced standard ──────────────────────────────
  {
    scanSpeed: "4s",
    left: (
      <>
        <line x1="74" y1="8" x2="74" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        <circle cx="74" cy="68" r="3.5" fill="currentColor" />
        <line x1="74" y1="68" x2="20" y2="68" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="68" r="2" fill="currentColor" />
        <circle cx="74" cy="138" r="3.5" fill="currentColor" />
        <line x1="74" y1="138" x2="6" y2="138" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="129" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="204" r="3.5" fill="currentColor" />
        <line x1="74" y1="204" x2="46" y2="204" stroke="currentColor" strokeWidth="1.5" />
        <line x1="46" y1="204" x2="46" y2="230" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="46" cy="230" r="2.5" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="272" r="3.5" fill="currentColor" />
        <line x1="74" y1="272" x2="6" y2="272" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="272" r="5.5" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="336" r="3.5" fill="currentColor" />
        <line x1="74" y1="336" x2="52" y2="336" stroke="currentColor" strokeWidth="1.5" />
        <line x1="52" y1="336" x2="52" y2="360" stroke="currentColor" strokeWidth="1.5" />
        <line x1="52" y1="360" x2="16" y2="360" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="360" r="2" fill="currentColor" />
        <circle cx="74" cy="404" r="3.5" fill="currentColor" />
        <line x1="74" y1="404" x2="28" y2="404" stroke="currentColor" strokeWidth="1.5" />
        <rect x="12" y="395" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="462" r="3.5" fill="currentColor" className="t-nd-alt" />
        <line x1="74" y1="462" x2="36" y2="462" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="36" cy="462" r="2" fill="currentColor" />
        <circle cx="74" cy="30" r="3" fill="currentColor" className="t-scan" />
      </>
    ),
    right: (
      <>
        <line x1="26" y1="8" x2="26" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        <circle cx="26" cy="85" r="3.5" fill="currentColor" />
        <line x1="26" y1="85" x2="80" y2="85" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="80" cy="85" r="2" fill="currentColor" />
        <circle cx="26" cy="152" r="3.5" fill="currentColor" />
        <line x1="26" y1="152" x2="84" y2="152" stroke="currentColor" strokeWidth="1.5" />
        <rect x="84" y="143" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="218" r="3.5" fill="currentColor" />
        <line x1="26" y1="218" x2="54" y2="218" stroke="currentColor" strokeWidth="1.5" />
        <line x1="54" y1="218" x2="54" y2="244" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="54" cy="244" r="2.5" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="285" r="3.5" fill="currentColor" />
        <line x1="26" y1="285" x2="94" y2="285" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="94" cy="285" r="5.5" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="348" r="3.5" fill="currentColor" />
        <line x1="26" y1="348" x2="48" y2="348" stroke="currentColor" strokeWidth="1.5" />
        <line x1="48" y1="348" x2="48" y2="372" stroke="currentColor" strokeWidth="1.5" />
        <line x1="48" y1="372" x2="84" y2="372" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="84" cy="372" r="2" fill="currentColor" />
        <circle cx="26" cy="415" r="3.5" fill="currentColor" />
        <line x1="26" y1="415" x2="72" y2="415" stroke="currentColor" strokeWidth="1.5" />
        <rect x="72" y="406" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="470" r="3.5" fill="currentColor" className="t-nd" />
        <line x1="26" y1="470" x2="64" y2="470" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="64" cy="470" r="2" fill="currentColor" />
        <circle cx="26" cy="30" r="3" fill="currentColor" className="t-scan t-scan-delay" />
      </>
    ),
  },
  // ── Variant 1: dense top cluster, fast scan ─────────────────────────
  {
    scanSpeed: "2.8s",
    left: (
      <>
        <line x1="74" y1="8" x2="74" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        <circle cx="74" cy="55" r="3.5" fill="currentColor" />
        <line x1="74" y1="55" x2="14" y2="55" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="55" r="2" fill="currentColor" />
        <circle cx="74" cy="92" r="3.5" fill="currentColor" />
        <line x1="74" y1="92" x2="6" y2="92" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="83" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="130" r="3.5" fill="currentColor" />
        <line x1="74" y1="130" x2="50" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="130" x2="50" y2="152" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="152" r="2.5" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="168" r="3.5" fill="currentColor" />
        <line x1="74" y1="168" x2="8" y2="168" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="168" r="5.5" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="290" r="3.5" fill="currentColor" className="t-nd-alt" />
        <line x1="74" y1="290" x2="22" y2="290" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="281" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="370" r="3.5" fill="currentColor" />
        <line x1="74" y1="370" x2="44" y2="370" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44" y1="370" x2="44" y2="396" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44" y1="396" x2="12" y2="396" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="396" r="2" fill="currentColor" />
        <circle cx="74" cy="450" r="3.5" fill="currentColor" className="t-nd-alt" />
        <line x1="74" y1="450" x2="30" y2="450" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="450" r="2" fill="currentColor" />
        <circle cx="74" cy="30" r="3" fill="currentColor" className="t-scan" />
      </>
    ),
    right: (
      <>
        <line x1="26" y1="8" x2="26" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        <circle cx="26" cy="60" r="3.5" fill="currentColor" />
        <line x1="26" y1="60" x2="86" y2="60" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="86" cy="60" r="2" fill="currentColor" />
        <circle cx="26" cy="98" r="3.5" fill="currentColor" />
        <line x1="26" y1="98" x2="80" y2="98" stroke="currentColor" strokeWidth="1.5" />
        <rect x="80" y="89" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="136" r="3.5" fill="currentColor" />
        <line x1="26" y1="136" x2="50" y2="136" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="136" x2="50" y2="158" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="158" r="2.5" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="174" r="3.5" fill="currentColor" />
        <line x1="26" y1="174" x2="92" y2="174" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="92" cy="174" r="5.5" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="295" r="3.5" fill="currentColor" className="t-nd" />
        <line x1="26" y1="295" x2="78" y2="295" stroke="currentColor" strokeWidth="1.5" />
        <rect x="76" y="286" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="375" r="3.5" fill="currentColor" />
        <line x1="26" y1="375" x2="56" y2="375" stroke="currentColor" strokeWidth="1.5" />
        <line x1="56" y1="375" x2="56" y2="400" stroke="currentColor" strokeWidth="1.5" />
        <line x1="56" y1="400" x2="88" y2="400" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="88" cy="400" r="2" fill="currentColor" />
        <circle cx="26" cy="455" r="3.5" fill="currentColor" className="t-nd" />
        <line x1="26" y1="455" x2="70" y2="455" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="70" cy="455" r="2" fill="currentColor" />
        <circle cx="26" cy="30" r="3" fill="currentColor" className="t-scan t-scan-delay" />
      </>
    ),
  },
  // ── Variant 2: long arms + staircase, slow scan ─────────────────────
  {
    scanSpeed: "6s",
    left: (
      <>
        <line x1="74" y1="8" x2="74" y2="512" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="t-spine" />
        <circle cx="74" cy="70" r="3.5" fill="currentColor" />
        <line x1="74" y1="70" x2="4" y2="70" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="61" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="155" r="3.5" fill="currentColor" />
        <line x1="74" y1="155" x2="20" y2="155" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="155" r="2" fill="currentColor" />
        <circle cx="74" cy="215" r="3.5" fill="currentColor" />
        <line x1="74" y1="215" x2="56" y2="215" stroke="currentColor" strokeWidth="1.5" />
        <line x1="56" y1="215" x2="56" y2="242" stroke="currentColor" strokeWidth="1.5" />
        <line x1="56" y1="242" x2="26" y2="242" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="242" r="2.5" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="295" r="3.5" fill="currentColor" />
        <line x1="74" y1="295" x2="6" y2="295" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="286" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="360" r="4" fill="currentColor" className="t-nd" />
        <line x1="74" y1="360" x2="2" y2="360" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="2" cy="360" r="6" fill="currentColor" className="t-nd" />
        <circle cx="74" cy="425" r="3.5" fill="currentColor" />
        <line x1="74" y1="425" x2="50" y2="425" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="425" x2="50" y2="450" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="450" x2="18" y2="450" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="450" r="2" fill="currentColor" />
        <circle cx="74" cy="474" r="3.5" fill="currentColor" className="t-nd-alt" />
        <line x1="74" y1="474" x2="8" y2="474" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="474" r="3" fill="currentColor" className="t-nd-alt" />
        <circle cx="74" cy="30" r="3" fill="currentColor" className="t-scan" />
      </>
    ),
    right: (
      <>
        <line x1="26" y1="8" x2="26" y2="512" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="t-spine" />
        <circle cx="26" cy="75" r="3.5" fill="currentColor" />
        <line x1="26" y1="75" x2="96" y2="75" stroke="currentColor" strokeWidth="1.5" />
        <rect x="82" y="66" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="160" r="3.5" fill="currentColor" />
        <line x1="26" y1="160" x2="80" y2="160" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="80" cy="160" r="2" fill="currentColor" />
        <circle cx="26" cy="220" r="3.5" fill="currentColor" />
        <line x1="26" y1="220" x2="44" y2="220" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44" y1="220" x2="44" y2="248" stroke="currentColor" strokeWidth="1.5" />
        <line x1="44" y1="248" x2="74" y2="248" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="248" r="2.5" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="300" r="3.5" fill="currentColor" />
        <line x1="26" y1="300" x2="94" y2="300" stroke="currentColor" strokeWidth="1.5" />
        <rect x="82" y="291" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="365" r="4" fill="currentColor" className="t-nd-alt" />
        <line x1="26" y1="365" x2="98" y2="365" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="98" cy="365" r="6" fill="currentColor" className="t-nd-alt" />
        <circle cx="26" cy="430" r="3.5" fill="currentColor" />
        <line x1="26" y1="430" x2="50" y2="430" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="430" x2="50" y2="455" stroke="currentColor" strokeWidth="1.5" />
        <line x1="50" y1="455" x2="82" y2="455" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="82" cy="455" r="2" fill="currentColor" />
        <circle cx="26" cy="478" r="3.5" fill="currentColor" className="t-nd" />
        <line x1="26" y1="478" x2="92" y2="478" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="92" cy="478" r="3" fill="currentColor" className="t-nd" />
        <circle cx="26" cy="30" r="3" fill="currentColor" className="t-scan t-scan-delay" />
      </>
    ),
  },
  // ── Variant 3: paired branches + IC-heavy, medium scan ──────────────
  {
    scanSpeed: "3.5s",
    left: (
      <>
        <line x1="74" y1="8" x2="74" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        {/* pair 1 */}
        <circle cx="74" cy="62" r="3.5" fill="currentColor" />
        <line x1="74" y1="62" x2="30" y2="62" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="62" r="2" fill="currentColor" />
        <circle cx="74" cy="90" r="3.5" fill="currentColor" />
        <line x1="74" y1="90" x2="6" y2="90" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="81" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        {/* lone big node */}
        <circle cx="74" cy="190" r="4" fill="currentColor" className="t-nd" />
        <line x1="74" y1="190" x2="8" y2="190" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="190" r="6" fill="currentColor" className="t-nd" />
        {/* pair 2 */}
        <circle cx="74" cy="282" r="3.5" fill="currentColor" />
        <line x1="74" y1="282" x2="6" y2="282" stroke="currentColor" strokeWidth="1.5" />
        <rect x="0" y="273" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="316" r="3.5" fill="currentColor" />
        <line x1="74" y1="316" x2="46" y2="316" stroke="currentColor" strokeWidth="1.5" />
        <line x1="46" y1="316" x2="46" y2="340" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="46" cy="340" r="2.5" fill="currentColor" className="t-nd-alt" />
        {/* pair 3 */}
        <circle cx="74" cy="402" r="3.5" fill="currentColor" className="t-nd-alt" />
        <line x1="74" y1="402" x2="22" y2="402" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="393" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="74" cy="438" r="3.5" fill="currentColor" />
        <line x1="74" y1="438" x2="38" y2="438" stroke="currentColor" strokeWidth="1.5" />
        <line x1="38" y1="438" x2="38" y2="462" stroke="currentColor" strokeWidth="1.5" />
        <line x1="38" y1="462" x2="10" y2="462" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="462" r="2" fill="currentColor" />
        <circle cx="74" cy="30" r="3" fill="currentColor" className="t-scan" />
      </>
    ),
    right: (
      <>
        <line x1="26" y1="8" x2="26" y2="512" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="t-spine" />
        {/* pair 1 */}
        <circle cx="26" cy="68" r="3.5" fill="currentColor" />
        <line x1="26" y1="68" x2="70" y2="68" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="70" cy="68" r="2" fill="currentColor" />
        <circle cx="26" cy="96" r="3.5" fill="currentColor" />
        <line x1="26" y1="96" x2="94" y2="96" stroke="currentColor" strokeWidth="1.5" />
        <rect x="80" y="87" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        {/* lone big node */}
        <circle cx="26" cy="195" r="4" fill="currentColor" className="t-nd-alt" />
        <line x1="26" y1="195" x2="92" y2="195" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="92" cy="195" r="6" fill="currentColor" className="t-nd-alt" />
        {/* pair 2 */}
        <circle cx="26" cy="287" r="3.5" fill="currentColor" />
        <line x1="26" y1="287" x2="94" y2="287" stroke="currentColor" strokeWidth="1.5" />
        <rect x="80" y="278" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="322" r="3.5" fill="currentColor" />
        <line x1="26" y1="322" x2="54" y2="322" stroke="currentColor" strokeWidth="1.5" />
        <line x1="54" y1="322" x2="54" y2="346" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="54" cy="346" r="2.5" fill="currentColor" className="t-nd" />
        {/* pair 3 */}
        <circle cx="26" cy="408" r="3.5" fill="currentColor" className="t-nd" />
        <line x1="26" y1="408" x2="78" y2="408" stroke="currentColor" strokeWidth="1.5" />
        <rect x="76" y="399" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="26" cy="444" r="3.5" fill="currentColor" />
        <line x1="26" y1="444" x2="62" y2="444" stroke="currentColor" strokeWidth="1.5" />
        <line x1="62" y1="444" x2="62" y2="468" stroke="currentColor" strokeWidth="1.5" />
        <line x1="62" y1="468" x2="90" y2="468" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="90" cy="468" r="2" fill="currentColor" />
        <circle cx="26" cy="30" r="3" fill="currentColor" className="t-scan t-scan-delay" />
      </>
    ),
  },
];

function TechDecor({ variant = 0 }: { variant?: number }): JSX.Element {
  const v = CIRCUIT_VARIANTS[variant] ?? CIRCUIT_VARIANTS[0];
  return (
    <>
      <div
        className="tech-decor tech-left"
        aria-hidden="true"
        style={{ "--scan-speed": v.scanSpeed } as React.CSSProperties}
      >
        <svg viewBox="0 0 100 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          {v.left}
        </svg>
      </div>
      <div
        className="tech-decor tech-right"
        aria-hidden="true"
        style={{ "--scan-speed": v.scanSpeed } as React.CSSProperties}
      >
        <svg viewBox="0 0 100 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          {v.right}
        </svg>
      </div>
    </>
  );
}

/* ── main component ── */
function Slide({
  data,
  currentPanel,
  onNextPanel,
  onPrevPanel,
  presIndex = 0
}: SlideProps): JSX.Element {
  const [animate, setAnimate] = useState<boolean>(false);
  const [panelKey, setPanelKey] = useState<number>(0);
  const [panelDir, setPanelDir] = useState<"right" | "left">("right");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [animType, setAnimType] = useState<string | null>(null);
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  /* slide entrance */
  useEffect(() => {
    setAnimate(false);
    setModalOpen(false);
    setCodeOpen(false);
    const t: NodeJS.Timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [data.id]);

  /* panel change animation */
  const prevPanelRef = useState(currentPanel)[1];
  useEffect(() => {
    setPanelDir(
      currentPanel > (panelKey > 0 ? panelKey - 1 : 0) ? "left" : "right"
    );
    setPanelKey((k) => k + 1);
  }, [currentPanel]);

  /* ESC closes modals */
  useEffect(() => {
    const h = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setCodeOpen(false);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openAnim = (type: string): void => {
    setAnimType(type);
    setModalOpen(true);
  };
  const openCode = (code: string): void => {
    setActiveCode(code);
    setCodeOpen(true);
  };

  /* ── TITLE SLIDE ── */
  if (data.type === "title") {
    return (
      <div className={`slide slide-title-type ${animate ? "animate" : ""}`}>
        <div className="title-content">
          <h1 className="main-title">{data.title}</h1>
          {data.subtitle && <h2 className="subtitle">{data.subtitle}</h2>}
          {data.bullets && (
            <ul className="bullet-list title-bullets">
              {data.bullets.map((b, i) => (
                <li
                  key={i}
                  className="bullet-item"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="bullet-marker">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  /* ── QUIZ SLIDE ── */
  if (data.type === "quiz") {
    return (
      <div className={`slide slide-quiz-type ${animate ? "animate" : ""}`}>
        <Quiz questions={data.questions} lessonTitle={data.lessonTitle} />
      </div>
    );
  }

  /* ── determine what to render (panels vs flat) ── */
  const hasPanels: boolean =
    Array.isArray(data.panels) && data.panels.length > 0;
  const totalPanels: number = hasPanels ? data.panels!.length : 1;
  const panel: SlidePanel | SlideData = hasPanels
    ? data.panels![currentPanel]
    : data;

  /* ── CONTENT SLIDE ── */
  return (
    <div className={`slide ${animate ? "animate" : ""}`}>
      <TechDecor variant={presIndex} />
      <FloatingParticles variant={presIndex} />

      <div className="slide-frame">
        <HexBg variant={presIndex} />

        {/* Corner accent brackets */}
        <span className="cb cb-tl" aria-hidden="true" />
        <span className="cb cb-tr" aria-hidden="true" />
        <span className="cb cb-bl" aria-hidden="true" />
        <span className="cb cb-br" aria-hidden="true" />

        {/* Title row */}
        <h2 className="slide-heading">{data.title}</h2>

        {/* 70 / 30 body */}
        <div className="slide-body">
          {/* ── RIGHT 70%: bullets / table / note ── */}
          <div className="slide-main" key={panelKey} data-dir={panelDir}>
            <AIInfo bullets={panel.bullets} />
            <ComparisonTable data={panel.comparison} />
            {panel.note && <div className="slide-note"> {panel.note}</div>}
          </div>

          {/* ── LEFT 30%: action buttons ── */}
          {(panel.animation || panel.code || data.animation || data.code) && (
            <div className="slide-actions">
              {(panel.animation || data.animation) && (
                <button
                  className="action-btn anim-btn"
                  onClick={() => openAnim(panel.animation || data.animation)}
                >
                  <span className="action-icon">🎬</span>
                  <span className="action-label">אנימציה</span>
                  <span className="action-sub">
                    {panel.animation === "eventloop" ||
                    data.animation === "eventloop"
                      ? "Event Loop"
                      : panel.animation === "heap" || data.animation === "heap"
                        ? "V8 Heap"
                        : panel.animation === "threadpool" ||
                            data.animation === "threadpool"
                          ? "Thread Pool"
                          : "הצג"}
                  </span>
                </button>
              )}
              {(panel.code || data.code) && (
                <button
                  className="action-btn code-btn"
                  onClick={() => openCode(panel.code || data.code)}
                >
                  <span className="action-icon">📄</span>
                  <span className="action-label">קוד</span>
                  <span className="action-sub">
                    {(panel.code || data.code).split("\n").length} שורות
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Panel navigation (if multi-panel slide) ── */}
        {hasPanels && (
          <div className="panel-nav">
            <button
              className="panel-arrow"
              onClick={onPrevPanel}
              disabled={currentPanel === 0}
            >
              ›
            </button>

            <div className="panel-dots">
              {data.panels.map((_, i) => (
                <span
                  key={i}
                  className={`panel-dot ${i === currentPanel ? "active" : ""}`}
                />
              ))}
            </div>

            <span className="panel-counter">
              {currentPanel + 1} / {totalPanels}
            </span>

            <button
              className="panel-arrow"
              onClick={onNextPanel}
              disabled={currentPanel === totalPanels - 1}
            >
              ‹
            </button>
          </div>
        )}
      </div>

      <AnimationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={animType}
      />
      <CodeModal
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
        code={activeCode}
        title={data.title}
      />
    </div>
  );
}

export default Slide;
