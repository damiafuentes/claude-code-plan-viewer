import { useMemo } from 'react';
import { usePlan } from './hooks/usePlan';
import { PlanViewer } from './components/PlanViewer';

function App() {
  const filename = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('plan');
  }, []);

  const { plan, loading, error, connected } = usePlan(filename);

  if (!filename) {
    return (
      <div className="min-h-screen bg-claude-bg-light dark:bg-claude-bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-claude-text-primary-light dark:text-claude-text-primary-dark mb-2">
            cc-plan-viewer
          </h1>
          <p className="text-claude-text-secondary-light dark:text-claude-text-secondary-dark text-sm">
            Waiting for a plan... The viewer will open automatically when Claude Code enters plan mode.
          </p>
        </div>
      </div>
    );
  }

  if (loading && !plan) {
    return (
      <div className="min-h-screen bg-claude-bg-light dark:bg-claude-bg-dark flex items-center justify-center">
        <p className="text-claude-text-secondary-light dark:text-claude-text-secondary-dark text-sm">
          Loading plan...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-claude-bg-light dark:bg-claude-bg-dark flex items-center justify-center">
        <p className="text-claude-accent-light dark:text-claude-accent-dark text-sm">
          {error}
        </p>
      </div>
    );
  }

  if (!plan) return null;

  return <PlanViewer plan={plan} connected={connected} />;
}

export default App;
