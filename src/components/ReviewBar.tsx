interface Props {
  hasComments: boolean;
  onCopy: () => void;
  copied: boolean;
}

export function ReviewBar({ hasComments, onCopy, copied }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-claude-surface-light/80 dark:bg-claude-surface-dark/80 backdrop-blur-lg border-t border-claude-border-light dark:border-claude-border-dark p-md">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-lg">
        <p className="text-xs text-claude-text-secondary-light dark:text-claude-text-secondary-dark leading-relaxed max-w-md">
          {hasComments
            ? 'Copy your feedback, go back to the terminal, and paste it when Claude asks for changes.'
            : 'Looks good? Go back to the terminal and approve. Want changes? Select text above and add comments.'}
        </p>
        <button
          onClick={onCopy}
          disabled={!hasComments}
          className="shrink-0 px-5 py-2 rounded-md text-sm font-semibold transition-all
            bg-claude-accent-light dark:bg-claude-accent-dark text-white
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:opacity-90"
        >
          {copied ? 'Copied!' : 'Copy feedback to clipboard'}
        </button>
      </div>
    </div>
  );
}
