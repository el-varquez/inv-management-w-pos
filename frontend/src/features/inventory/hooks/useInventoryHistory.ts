import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { InventoryHistoryItem } from '../../../types';
import { getApiErrorMessage } from '../../../services/apiError';

export interface InventoryHistoryFilters {
  from?: string;
  to?: string;
  type?: string;
}

export const useInventoryHistory = (filters?: InventoryHistoryFilters) => {
  const [history, setHistory] = useState<InventoryHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Strip empty strings so we don't send blank query params.
      const params: InventoryHistoryFilters = {};
      if (filters?.from) params.from = filters.from;
      if (filters?.to) params.to = filters.to;
      if (filters?.type) params.type = filters.type;
      const data = await inventoryService.getHistory(params);
      setHistory(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load history.'));
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetch();
  }, [filters?.from, filters?.to, filters?.type]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return { history, loading, error, refetch: fetch };
};
