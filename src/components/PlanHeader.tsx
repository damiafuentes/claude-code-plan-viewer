interface Props {
  title: string;
  filename: string;
  connected: boolean;
}

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PlanHeader({ title, filename, connected }: Props) {
  return (
    <header className="mb-lg">
      <div className="flex items-center gap-sm mb-xs">
        <span
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-claude-success-light dark:bg-claude-success-dark' : 'bg-claude-text-tertiary-light dark:bg-claude-text-tertiary-dark'
          }`}
          title={connected ? 'Live' : 'Disconnected'}
        />
        <span className="text-xs text-claude-text-tertiary-light dark:text-claude-text-tertiary-dark font-medium uppercase tracking-wide">
          Plan Review
        </span>
      </div>
      <h1 className="text-2xl font-bold text-claude-text-primary-light dark:text-claude-text-primary-dark leading-tight">
        {title}
      </h1>
      <p className="text-sm text-claude-text-secondary-light dark:text-claude-text-secondary-dark mt-1">
        {humanizeFilename(filename)}
      </p>
    </header>
  );
}
