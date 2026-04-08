import { useState } from 'react';

interface Props {
  sectionId: string;
  lineRange: [number, number];
  onSubmit: (sectionId: string, lineRange: [number, number], body: string) => void;
  onCancel: () => void;
}

export function InlineCommentForm({ sectionId, lineRange, onSubmit, onCancel }: Props) {
  const [body, setBody] = useState('');

  const handleSubmit = () => {
    if (body.trim()) {
      onSubmit(sectionId, lineRange, body.trim());
      setBody('');
      onCancel();
    }
  };

  return (
    <div className="mt-2 mb-4 rounded-md border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment..."
        className="w-full min-h-[80px] bg-transparent text-claude-text-primary-light dark:text-claude-text-primary-dark placeholder:text-claude-text-tertiary-light dark:placeholder:text-claude-text-tertiary-dark resize-y border-none outline-none text-sm leading-relaxed"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) handleSubmit();
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm rounded-sm text-claude-text-secondary-light dark:text-claude-text-secondary-dark hover:bg-claude-border-light/50 dark:hover:bg-claude-border-dark/50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!body.trim()}
          className="px-3 py-1.5 text-sm rounded-sm bg-claude-accent-light dark:bg-claude-accent-dark text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Comment
        </button>
      </div>
    </div>
  );
}
