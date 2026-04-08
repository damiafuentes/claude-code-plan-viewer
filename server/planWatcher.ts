import fs from 'node:fs';
import path from 'node:path';
import { parsePlan } from './planParser.js';

type PlanUpdateCallback = (filename: string, content: string) => void;

export function watchPlansDir(plansDir: string, onUpdate: PlanUpdateCallback): void {
  if (!fs.existsSync(plansDir)) {
    console.warn(`[cc-plan-viewer] Plans directory not found: ${plansDir}`);
    return;
  }

  const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();

  fs.watch(plansDir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) return;
    // Ignore review files
    if (filename.endsWith('.review.json')) return;

    // Debounce 300ms per file
    const existing = debounceMap.get(filename);
    if (existing) clearTimeout(existing);

    debounceMap.set(
      filename,
      setTimeout(() => {
        debounceMap.delete(filename);
        const filePath = path.join(plansDir, filename);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          onUpdate(filename, content);
        } catch {
          // File may have been deleted
        }
      }, 300)
    );
  });

  console.log(`[cc-plan-viewer] Watching plans directory: ${plansDir}`);
}
