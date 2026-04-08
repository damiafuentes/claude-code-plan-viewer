import { useState, useRef, useEffect } from 'react';

interface Props {
  id: string;
  body: string;
  selectedText: string;
  top: number;
  active: boolean;
  onEdit: (id: string, newBody: string) => void;
  onDelete: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function CommentCard({ id, body, selectedText, top, active, onEdit, onDelete, onHover }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(body);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [editing]);

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(id, editValue.trim());
      setEditing(false);
    }
  };

  return (
    <div
      data-comment-card
      className={`w-64 transition-all duration-200 ${active ? 'z-20 scale-[1.02]' : 'z-10'} ${top > 0 ? 'absolute right-0' : 'relative w-full'}`}
      style={top > 0 ? { top } : undefined}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={`rounded-lg border bg-claude-surface-light dark:bg-claude-surface-dark shadow-sm transition-colors
          ${active
            ? 'border-claude-accent-light dark:border-claude-accent-dark shadow-md'
            : 'border-claude-border-light dark:border-claude-border-dark'
          }`}
      >
        {/* Quoted text preview */}
        <div className="px-3 pt-2.5 pb-1">
          <p className="text-[11px] text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark italic leading-snug truncate">
            "{selectedText.length > 60 ? selectedText.slice(0, 60) + '...' : selectedText}"
          </p>
        </div>

        {/* Comment body or edit form */}
        <div className="px-3 pb-2">
          {editing ? (
            <div>
              <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={2}
                className="w-full mt-1 bg-transparent text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark resize-none border border-claude-border-light dark:border-claude-border-dark rounded p-1.5 outline-none focus:border-claude-accent-light dark:focus:border-claude-accent-dark leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) { e.preventDefault(); handleSave(); }
                  if (e.key === 'Escape') { setEditing(false); setEditValue(body); }
                }}
              />
              <div className="flex justify-end gap-1 mt-1">
                <button
                  onClick={() => { setEditing(false); setEditValue(body); }}
                  className="px-2 py-0.5 text-[11px] rounded text-claude-text-secondary-light dark:text-claude-text-secondary-dark hover:bg-claude-border-light/50 dark:hover:bg-claude-border-dark/50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editValue.trim()}
                  className="px-2 py-0.5 text-[11px] rounded bg-claude-accent-light dark:bg-claude-accent-dark text-white disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark leading-relaxed mt-1">
              {body}
            </p>
          )}
        </div>

        {/* Actions — visible on hover */}
        {!editing && (
          <div className={`flex justify-end gap-0.5 px-2 pb-2 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-0.5 text-[11px] rounded text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark hover:text-claude-text-primary-light dark:hover:text-claude-text-primary-dark hover:bg-claude-border-light/50 dark:hover:bg-claude-border-dark/50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="px-2 py-0.5 text-[11px] rounded text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
