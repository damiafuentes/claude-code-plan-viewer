#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');
const HOOKS_DIR = path.join(os.homedir(), '.claude', 'hooks');

// Resolve the hook script path
// When compiled: dist/server/bin/ → dist/server/ → dist/ → pkg root → hooks/
// When running via tsx: bin/ → pkg root → hooks/
const hookSource = path.resolve(
  import.meta.dirname, '..', '..', '..', 'hooks', 'plan-viewer-hook.cjs'
);
// Fallback for dev mode (running from bin/ directly)
const hookSourceDev = path.resolve(import.meta.dirname, '..', 'hooks', 'plan-viewer-hook.cjs');
const resolvedHookSource = fs.existsSync(hookSource) ? hookSource : hookSourceDev;

function readSettings(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function writeSettings(settings: Record<string, unknown>): void {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n', 'utf8');
}

function getHookCommand(): string {
  return `node "${resolvedHookSource}"`;
}

function install(): void {
  console.log('[cc-plan-viewer] Installing hook...');

  // Ensure hooks directory exists
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }

  // Read current settings
  const settings = readSettings();

  // Ensure hooks object exists
  if (!settings.hooks || typeof settings.hooks !== 'object') {
    settings.hooks = {};
  }
  const hooks = settings.hooks as Record<string, unknown[]>;

  // Ensure PostToolUse array exists
  if (!Array.isArray(hooks.PostToolUse)) {
    hooks.PostToolUse = [];
  }

  const hookCommand = getHookCommand();

  // Check if already installed
  const alreadyInstalled = hooks.PostToolUse.some((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const e = entry as Record<string, unknown>;
    if (!Array.isArray(e.hooks)) return false;
    return e.hooks.some((h: unknown) => {
      if (typeof h !== 'object' || h === null) return false;
      return (h as Record<string, unknown>).command === hookCommand;
    });
  });

  if (alreadyInstalled) {
    console.log('[cc-plan-viewer] Hook already installed.');
    return;
  }

  // Add the hook entry
  hooks.PostToolUse.push({
    matcher: 'Write|Edit',
    hooks: [
      {
        type: 'command',
        command: hookCommand,
      },
    ],
  });

  writeSettings(settings);
  console.log('[cc-plan-viewer] Hook installed successfully.');
  console.log(`[cc-plan-viewer] Hook script: ${resolvedHookSource}`);
  console.log('[cc-plan-viewer] Added to: ~/.claude/settings.json (PostToolUse)');
}

function uninstall(): void {
  console.log('[cc-plan-viewer] Uninstalling hook...');

  const settings = readSettings();
  const hooks = settings.hooks as Record<string, unknown[]> | undefined;
  if (!hooks?.PostToolUse || !Array.isArray(hooks.PostToolUse)) {
    console.log('[cc-plan-viewer] No hook found to remove.');
    return;
  }

  const hookCommand = getHookCommand();
  const before = hooks.PostToolUse.length;

  hooks.PostToolUse = hooks.PostToolUse.filter((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return true;
    const e = entry as Record<string, unknown>;
    if (!Array.isArray(e.hooks)) return true;
    return !e.hooks.some((h: unknown) => {
      if (typeof h !== 'object' || h === null) return false;
      const cmd = (h as Record<string, unknown>).command;
      return typeof cmd === 'string' && cmd.includes('plan-viewer-hook');
    });
  });

  if (hooks.PostToolUse.length === before) {
    console.log('[cc-plan-viewer] No hook found to remove.');
    return;
  }

  writeSettings(settings);
  console.log('[cc-plan-viewer] Hook removed successfully.');
}

function start(): void {
  console.log('[cc-plan-viewer] Starting server...');
  // Import and run the server
  import('../server/index.js');
}

function open(filename?: string): void {
  const port = 3847;
  const url = filename
    ? `http://localhost:${port}/?plan=${encodeURIComponent(filename)}`
    : `http://localhost:${port}`;
  try {
    execSync(`open "${url}"`, { stdio: 'ignore' });
    console.log(`[cc-plan-viewer] Opened ${url}`);
  } catch {
    console.log(`[cc-plan-viewer] Open this URL in your browser: ${url}`);
  }
}

// CLI
const command = process.argv[2];
switch (command) {
  case 'install':
    install();
    break;
  case 'uninstall':
    uninstall();
    break;
  case 'start':
    start();
    break;
  case 'open':
    open(process.argv[3]);
    break;
  default:
    console.log(`
cc-plan-viewer — Browser-based review UI for Claude Code plans

Commands:
  install     Add the PostToolUse hook to ~/.claude/settings.json
  uninstall   Remove the hook
  start       Start the server (for development)
  open [file] Open a plan in the browser
`);
}
