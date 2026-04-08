import type { InlineComment } from '../lib/types';

interface Props {
  comments: InlineComment[];
  onRemove: (index: number) => void;
}

export function CommentSidebar({ comments, onRemove }: Props) {
  if (comments.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark">
        Comments ({comments.length})
      </h3>
      {comments.map((comment, idx) => (
        <div
          key={idx}
          className="rounded-md border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-3 group"
        >
          {/* Quoted text */}
          {comment.selectedText && (
            <div className="mb-2 pl-2.5 border-l-2 border-claude-accent-light dark:border-claude-accent-dark">
              <p className="text-xs text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark italic leading-relaxed">
                {comment.selectedText.length > 120
                  ? comment.selectedText.slice(0, 120) + '...'
                  : comment.selectedText}
              </p>
            </div>
          )}
          {/* Comment body */}
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark leading-relaxed">
              {comment.body}
            </p>
            <button
              onClick={() => onRemove(idx)}
              className="opacity-0 group-hover:opacity-100 text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark hover:text-claude-accent-light dark:hover:text-claude-accent-dark text-sm shrink-0 transition-opacity"
              title="Remove"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
