import type { InlineComment } from '../lib/types';

interface Props {
  comments: InlineComment[];
  onRemove: (index: number) => void;
}

export function CommentThread({ comments, onRemove }: Props) {
  if (comments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {comments.map((comment, idx) => (
        <div
          key={idx}
          className="rounded-sm border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-3 text-sm"
        >
          <div className="flex justify-between items-start gap-2">
            <p className="text-claude-text-primary-light dark:text-claude-text-primary-dark leading-relaxed flex-1">
              {comment.body}
            </p>
            <button
              onClick={() => onRemove(idx)}
              className="text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark hover:text-claude-accent-light dark:hover:text-claude-accent-dark text-xs shrink-0"
              title="Remove comment"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
