import { useState, useRef, useCallback, useEffect } from 'react';
import type { PlanData } from '../lib/types';
import { PlanHeader } from './PlanHeader';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SelectionPopover } from './SelectionPopover';
import { CommentCard } from './CommentCard';
import { GeneralComment } from './GeneralComment';
import { ReviewBar } from './ReviewBar';
import { useReview } from '../hooks/useReview';
import { useTextSelection } from '../hooks/useTextSelection';
import {
  createPendingHighlight,
  removePendingHighlight,
  promotePendingHighlight,
  removeHighlights,
  setHighlightActive,
  getCommentIdFromElement,
} from '../lib/highlights';

interface Props {
  plan: PlanData;
  connected: boolean;
}

export function PlanViewer({ plan, connected }: Props) {
  const review = useReview(plan.filename);
  const contentRef = useRef<HTMLDivElement>(null);
  const { selection, clearSelection } = useTextSelection(contentRef);
  const [hoveredComment, setHoveredComment] = useState<string | null>(null);
  const pendingRef = useRef(false);

  // Create pending highlight as soon as selection appears
  useEffect(() => {
    if (selection && !pendingRef.current) {
      createPendingHighlight(selection.range);
      pendingRef.current = true;
      // Clear the browser selection so the blue highlight goes away,
      // but our <mark> keeps the text visually highlighted
      window.getSelection()?.removeAllRanges();
    }
    if (!selection && pendingRef.current) {
      // Selection was cleared without submitting — remove pending
      removePendingHighlight();
      pendingRef.current = false;
    }
  }, [selection]);

  // Bidirectional hover: when hoveredComment changes, toggle active class on marks
  useEffect(() => {
    // Clear all active states first
    document.querySelectorAll('mark.comment-highlight.active').forEach((el) => {
      el.classList.remove('active');
    });
    // Set active on the hovered comment's marks
    if (hoveredComment) {
      setHighlightActive(hoveredComment, true);
    }
  }, [hoveredComment]);

  // Listen for mouse events on highlight marks in the content area
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const id = getCommentIdFromElement(e.target as HTMLElement);
      if (id && id !== '__pending__') setHoveredComment(id);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const id = getCommentIdFromElement(e.target as HTMLElement);
      if (id && hoveredComment === id) setHoveredComment(null);
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [hoveredComment]);

  const handleCommentSubmit = useCallback(
    (body: string) => {
      if (!selection || !contentRef.current) return;

      // Calculate anchor position relative to the content container
      const containerRect = contentRef.current.getBoundingClientRect();
      const anchorTop = selection.rect.top - containerRect.top + contentRef.current.scrollTop;

      // Add comment to state
      const id = review.addComment(selection.text, body, anchorTop);

      // Promote the pending highlight to a real one
      promotePendingHighlight(id);
      pendingRef.current = false;

      clearSelection();
    },
    [selection, review.addComment, clearSelection]
  );

  const handleCancelComment = useCallback(() => {
    removePendingHighlight();
    pendingRef.current = false;
    clearSelection();
  }, [clearSelection]);

  const handleDeleteComment = useCallback(
    (id: string) => {
      removeHighlights(id);
      review.deleteComment(id);
      if (hoveredComment === id) setHoveredComment(null);
    },
    [review.deleteComment, hoveredComment]
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = review.formatForClipboard();
    await navigator.clipboard.writeText(text);
    await review.submit('feedback');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Sort comments by vertical position and spread so they don't overlap
  const positioned = (() => {
    const sorted = [...review.comments].sort((a, b) => a.anchorTop - b.anchorTop);
    const result: { comment: typeof sorted[0]; top: number }[] = [];
    for (const comment of sorted) {
      let top = comment.anchorTop;
      if (result.length > 0) {
        const prevTop = result[result.length - 1].top;
        top = Math.max(top, prevTop + 90);
      }
      result.push({ comment, top });
    }
    return result;
  })();

  return (
    <div className="min-h-screen bg-claude-bg-light dark:bg-claude-bg-dark">
      <div className="max-w-[1200px] mx-auto px-md py-xl pb-40">
        <div className="max-w-3xl mx-auto">
          <PlanHeader
            title={plan.parsed.title}
            filename={plan.filename}
            connected={connected}
          />
        </div>

        {/* Content area with right margin for comments */}
        <div className="relative">
          {/* Plan content */}
          <div
            ref={contentRef}
            className="max-w-3xl mx-auto rounded-lg border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-lg md:p-xl
              text-claude-text-primary-light dark:text-claude-text-primary-dark"
          >
            <MarkdownRenderer content={plan.parsed.rawMarkdown} />
          </div>

          {/* Comment cards pinned to the right */}
          <div
            className="absolute top-0 hidden xl:block"
            style={{ left: 'calc(50% + 384px + 24px)', width: '256px' }}
          >
            {positioned.map(({ comment, top }) => (
              <CommentCard
                key={comment.id}
                id={comment.id}
                body={comment.body}
                selectedText={comment.selectedText}
                top={top}
                active={hoveredComment === comment.id}
                onEdit={review.editComment}
                onDelete={handleDeleteComment}
                onHover={setHoveredComment}
              />
            ))}
          </div>

          {/* Mobile/tablet: comments below content */}
          {review.comments.length > 0 && (
            <div className="xl:hidden max-w-3xl mx-auto mt-lg space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark">
                Comments ({review.comments.length})
              </h3>
              {review.comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  body={comment.body}
                  selectedText={comment.selectedText}
                  top={0}
                  active={hoveredComment === comment.id}
                  onEdit={review.editComment}
                  onDelete={handleDeleteComment}
                  onHover={setHoveredComment}
                />
              ))}
            </div>
          )}
        </div>

        {/* General comment */}
        <div className="max-w-3xl mx-auto mt-lg">
          <GeneralComment
            value={review.overallComment}
            onChange={review.setOverallComment}
          />
        </div>
      </div>

      {/* Selection popover */}
      {selection && (
        <SelectionPopover
          rect={selection.rect}
          onSubmit={handleCommentSubmit}
          onCancel={handleCancelComment}
        />
      )}

      {/* Review bar */}
      <ReviewBar
        hasComments={review.hasComments}
        onCopy={handleCopy}
        copied={copied}
      />

    </div>
  );
}
