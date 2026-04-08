import fs from 'node:fs';
import path from 'node:path';

export interface InlineComment {
  sectionId: string;
  lineRange: [number, number];
  body: string;
  createdAt: string;
}

export interface PlanReview {
  planFile: string;
  action: string; // the plan mode option chosen, or "feedback"
  submittedAt: string;
  consumedAt: string | null;
  overallComment: string;
  inlineComments: InlineComment[];
}

function reviewPathFor(planPath: string): string {
  const dir = path.dirname(planPath);
  const base = path.basename(planPath, '.md');
  return path.join(dir, `${base}.review.json`);
}

export function saveReview(planPath: string, review: PlanReview): void {
  const reviewPath = reviewPathFor(planPath);
  fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2), 'utf8');
}

export function getReview(planPath: string): PlanReview | null {
  const reviewPath = reviewPathFor(planPath);
  if (!fs.existsSync(reviewPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  } catch {
    return null;
  }
}

export function getUnconsumedReview(planPath: string): PlanReview | null {
  const review = getReview(planPath);
  if (review && !review.consumedAt) return review;
  return null;
}

export function markConsumed(planPath: string): void {
  const review = getReview(planPath);
  if (review) {
    review.consumedAt = new Date().toISOString();
    const reviewPath = reviewPathFor(planPath);
    fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2), 'utf8');
  }
}
