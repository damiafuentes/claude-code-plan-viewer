# cc-plan-viewer

A browser-based review UI for Claude Code plans. When Claude Code enters plan mode, a browser tab opens automatically showing the plan rendered beautifully. You can select text, add inline comments, and copy your feedback to paste back in the terminal.

<!-- TODO: add screenshot -->

## Install

```bash
npx cc-plan-viewer install
```

This adds a PostToolUse hook to your Claude Code settings that automatically opens the viewer when a plan is written.

## Uninstall

```bash
npx cc-plan-viewer uninstall
```

## How it works

1. Claude Code writes a plan file
2. A PostToolUse hook detects it and opens a browser tab
3. The plan is rendered with proper markdown formatting, syntax highlighting, and typography
4. Select any text to add inline comments
5. Copy your feedback to clipboard, go back to the terminal, and paste it

The viewer runs a lightweight local server (auto-started on demand, auto-shutdown after 30 minutes of inactivity). No data leaves your machine.

## Requirements

- Node.js 18+
- Claude Code

## License

MIT
