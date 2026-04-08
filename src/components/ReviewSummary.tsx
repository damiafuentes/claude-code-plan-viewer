import type { InlineComment } from '../lib/types';

interface Props {
  inlineComments: InlineComment[];
  overallComment: string;
  onConfirm: () => void;
  onCancel: () => void;
  onCopyToClipboard: () => void;
}

export function ReviewSummary({ inlineComments, overallComment, onConfirm, onCancel, onCopyToClipboard }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-claude-surface-light dark:bg-claude-surface-dark rounded-lg border border-claude-border-light dark:border-claude-border-dark shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-lg">
          <h2 className="text-lg font-bold text-claude-text-primary-light dark:text-claude-text-primary-dark mb-md">
            Review Summary
          </h2>

          {inlineComments.length > 0 && (
            <div className="mb-md">
              <h3 className="text-sm font-semibold text-claude-text-secondary-light dark:text-claude-text-secondary-dark mb-sm">
                Inline comments ({inlineComments.length})
              </h3>
              <div className="space-y-2">
                {inlineComments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="rounded-sm border border-claude-border-light dark:border-claude-border-dark p-3 text-sm"
                  >
                    {comment.selectedText && (
                      <div className="mb-2 pl-2.5 border-l-2 border-claude-accent-light dark:border-claude-accent-dark">
                        <p className="text-xs text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark italic">
                          "{comment.selectedText.length > 100
                            ? comment.selectedText.slice(0, 100) + '...'
                            : comment.selectedText}"
                        </p>
                      </div>
                    )}
                    <p className="text-claude-text-primary-light dark:text-claude-text-primary-dark">
                      {comment.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {overallComment && (
            <div className="mb-md">
              <h3 className="text-sm font-semibold text-claude-text-secondary-light dark:text-claude-text-secondary-dark mb-sm">
                General comment
              </h3>
              <p className="text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark border border-claude-border-light dark:border-claude-border-dark rounded-sm p-3">
                {overallComment}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-md border-t border-claude-border-light dark:border-claude-border-dark">
          <button
            onClick={onCopyToClipboard}
            className="px-3 py-1.5 text-sm text-claude-text-secondary-light dark:text-claude-text-secondary-dark hover:text-claude-text-primary-light dark:hover:text-claude-text-primary-dark transition-colors"
          >
            Copy to clipboard
          </button>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-md text-claude-text-secondary-light dark:text-claude-text-secondary-dark hover:bg-claude-border-light/30 dark:hover:bg-claude-border-dark/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-md bg-claude-accent-light dark:bg-claude-accent-dark text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Send feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
