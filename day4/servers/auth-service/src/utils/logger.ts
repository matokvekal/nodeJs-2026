// Structured logger — outputs one JSON line per event
// Easy to read in terminal, easy to parse with PM2 / log tools

type Level = 'info' | 'warn' | 'error';

export function log(level: Level, event: string, data: Record<string, unknown> = {}) {
  console.log(JSON.stringify({
    level,
    event,
    pid: process.pid,
    ...data,
    ts: new Date().toISOString(),
  }));
}
