export interface PlanSection {
  id: string;
  heading: string;
  level: number;
  startLine: number;
  endLine: number;
  rawContent: string;
  children: PlanSection[];
}

export interface ParsedPlan {
  title: string;
  sections: PlanSection[];
  rawMarkdown: string;
}

export interface InlineComment {
  sectionId: string;
  lineRange: [number, number];
  body: string;
  createdAt: string;
  selectedText?: string;
}

export interface PlanReview {
  planFile: string;
  action: string;
  submittedAt: string;
  consumedAt: string | null;
  overallComment: string;
  inlineComments: InlineComment[];
}

export interface PlanMeta {
  filename: string;
  modified: string;
  size: number;
  hasReview: boolean;
  reviewAction: string | null;
}

export interface PlanData {
  filename: string;
  parsed: ParsedPlan;
  review: PlanReview | null;
}

export interface WsMessage {
  type: 'plan-updated' | 'plan-created' | 'review-submitted' | 'review-consumed';
  filename: string;
  planOptions?: string[] | null;
  action?: string;
}
