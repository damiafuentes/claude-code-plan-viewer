import { useState, useEffect, useCallback } from 'react';
import { fetchPlan } from '../lib/api';
import { useWebSocket } from './useWebSocket';
import type { PlanData, WsMessage } from '../lib/types';

export function usePlan(filename: string | null) {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planOptions, setPlanOptions] = useState<string[] | null>(null);

  const loadPlan = useCallback(async () => {
    if (!filename) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlan(filename);
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, [filename]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const onWsMessage = useCallback(
    (msg: WsMessage) => {
      if (msg.type === 'plan-updated' && msg.filename === filename) {
        loadPlan();
        if (msg.planOptions) {
          setPlanOptions(msg.planOptions);
        }
      }
    },
    [filename, loadPlan]
  );

  const { connected } = useWebSocket(onWsMessage);

  return { plan, loading, error, connected, planOptions, reload: loadPlan };
}
