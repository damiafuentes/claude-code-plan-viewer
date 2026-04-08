import type { PlanData, PlanMeta } from './types';

const BASE = '/api';

export async function fetchPlans(): Promise<PlanMeta[]> {
  const res = await fetch(`${BASE}/plans`);
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}

export async function fetchPlan(filename: string): Promise<PlanData> {
  const res = await fetch(`${BASE}/plans/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json();
}

export async function submitReview(
  filename: string,
  review: {
    action: string;
    overallComment: string;
    inlineComments: { sectionId: string; lineRange: [number, number]; body: string }[];
  }
): Promise<void> {
  const res = await fetch(`${BASE}/reviews/${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to submit review');
}
