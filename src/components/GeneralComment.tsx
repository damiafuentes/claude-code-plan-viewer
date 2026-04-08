interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function GeneralComment({ value, onChange }: Props) {
  return (
    <div className="border-t border-claude-border-light dark:border-claude-border-dark pt-md mb-md">
      <label className="block text-sm font-medium text-claude-text-secondary-light dark:text-claude-text-secondary-dark mb-sm">
        General comment
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Leave a general comment about this plan..."
        className="w-full min-h-[80px] rounded-md border border-claude-border-light dark:border-claude-border-dark bg-claude-surface-light dark:bg-claude-surface-dark p-3 text-sm text-claude-text-primary-light dark:text-claude-text-primary-dark placeholder:text-claude-text-tertiary-light dark:placeholder:text-claude-text-tertiary-dark resize-y outline-none focus:border-claude-accent-light dark:focus:border-claude-accent-dark transition-colors"
      />
    </div>
  );
}
