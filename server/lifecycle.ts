import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const TMP_DIR = os.tmpdir();
const PID_FILE = path.join(TMP_DIR, 'cc-plan-viewer.pid');
const PORT_FILE = path.join(TMP_DIR, 'cc-plan-viewer-port');

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

let idleTimer: ReturnType<typeof setTimeout> | null = null;

export function writePidFile(): void {
  fs.writeFileSync(PID_FILE, String(process.pid), 'utf8');
}

export function writePortFile(port: number): void {
  fs.writeFileSync(PORT_FILE, String(port), 'utf8');
}

export function cleanupFiles(): void {
  try { fs.unlinkSync(PID_FILE); } catch {}
  try { fs.unlinkSync(PORT_FILE); } catch {}
}

export function resetIdleTimer(): void {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    console.log('[cc-plan-viewer] Idle timeout reached, shutting down.');
    cleanupFiles();
    process.exit(0);
  }, IDLE_TIMEOUT_MS);
  // Don't keep the process alive just for the timer
  idleTimer.unref();
}

export function readPortFile(): number | null {
  try {
    const port = parseInt(fs.readFileSync(PORT_FILE, 'utf8').trim(), 10);
    return isNaN(port) ? null : port;
  } catch {
    return null;
  }
}

export function isServerRunning(): boolean {
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
    if (isNaN(pid)) return false;
    process.kill(pid, 0); // check if alive
    return true;
  } catch {
    return false;
  }
}
