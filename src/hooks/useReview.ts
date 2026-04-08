import { useState, useCallback } from 'react';
import { submitReview } from '../lib/api';

export interface Comment {
  id: string;
  selectedText: string;
  body: string;
  /** Y offset in the document (relative to content container top), set after highlight */
  anchorTop: number;
  createdAt: string;
}

interface ReviewState {
  comments: Comment[];
  overallComment: string;
  submitted: boolean;
  submitting: boolean;
}

let commentCounter = 0;

export function useReview(filename: string | null) {
  const [state, setState] = useState<ReviewState>({
    comments: [],
    overallComment: '',
    submitted: false,
    submitting: false,
  });

  const addComment = useCallback(
    (selectedText: string, body: string, anchorTop: number) => {
      const id = `comment-${++commentCounter}`;
      setState((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          { id, selectedText, body, anchorTop, createdAt: new Date().toISOString() },
        ],
      }));
      return id;
    },
    []
  );

  const editComment = useCallback((id: string, newBody: string) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.map((c) => (c.id === id ? { ...c, body: newBody } : c)),
    }));
  }, []);

  const deleteComment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== id),
    }));
  }, []);

  const setOverallComment = useCallback((comment: string) => {
    setState((prev) => ({ ...prev, overallComment: comment }));
  }, []);

  const hasComments = state.comments.length > 0 || state.overallComment.trim().length > 0;

  const submit = useCallback(
    async (action: string) => {
      if (!filename) return;
      setState((prev) => ({ ...prev, submitting: true }));
      try {
        await submitReview(filename, {
          action,
          overallComment: state.overallComment,
          inlineComments: state.comments.map((c) => ({
            sectionId: c.selectedText,
            lineRange: [0, 0] as [number, number],
            body: c.body,
          })),
        });
        setState((prev) => ({ ...prev, submitted: true, submitting: false }));
      } catch {
        setState((prev) => ({ ...prev, submitting: false }));
      }
    },
    [filename, state.overallComment, state.comments]
  );

  const formatForClipboard = useCallback(() => {
    let text = 'PLAN REVIEW FEEDBACK\n';
    text += '====================\n\n';
    if (state.comments.length > 0) {
      text += `${state.comments.length} inline comment(s):\n\n`;
      for (let i = 0; i < state.comments.length; i++) {
        const c = state.comments[i];
        text += `--- Comment ${i + 1} ---\n`;
        text += `Selected text: "${c.selectedText}"\n`;
        text += `Feedback: ${c.body}\n\n`;
      }
    }
    if (state.overallComment) {
      text += `--- General comment ---\n`;
      text += `${state.overallComment}\n`;
    }
    return text;
  }, [state.comments, state.overallComment]);

  return {
    ...state,
    hasComments,
    addComment,
    editComment,
    deleteComment,
    setOverallComment,
    submit,
    formatForClipboard,
  };
}
