import { useState, useRef, useEffect } from 'react';

interface Props {
  rect: DOMRect;
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function SelectionPopover({ rect, onSubmit, onCancel }: Props) {
  const [comment, setComment] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const top = rect.bottom + window.scrollY + 6;
  const left = rect.left + window.scrollX;

  return (
    <div
      data-popover
      className="absolute z-50"
      style={{ top, left }}
    >
      <div className="w-[300px] rounded-lg shadow-2xl border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark overflow-hidden">
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment..."
            rows={3}
            className="w-full bg-transparent text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark placeholder:text-claude-text-tertiary-light dark:placeholder:text-claude-text-tertiary-dark resize-none border-none outline-none leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey && comment.trim()) {
                e.preventDefault();
                onSubmit(comment.trim());
              }
              if (e.key === 'Escape') onCancel();
            }}
          />
        </div>
        <div className="flex justify-between items-center px-3 py-2 border-t border-claude-border-light dark:border-claude-border-dark">
          <span className="text-[10px] text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark">
            Cmd+Enter
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={onCancel}
              className="px-2.5 py-1 text-xs rounded text-claude-text-secondary-light dark:text-claude-text-secondary-dark hover:bg-claude-border-light/50 dark:hover:bg-claude-border-dark/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => comment.trim() && onSubmit(comment.trim())}
              disabled={!comment.trim()}
              className="px-2.5 py-1 text-xs rounded bg-claude-accent-light dark:bg-claude-accent-dark text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
