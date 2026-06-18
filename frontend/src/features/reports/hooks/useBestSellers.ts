import { useEffect, useState } from 'react';
import { reportsService, type DateRange } from '../services/reportsService';
import { getApiErrorMessage } from '../../../services/apiError';
import type { BestSeller } from '../../../types';

export const useBestSellers = (range?: DateRange) => {
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getBestSellers(range);
      setBestSellers(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load best sellers.'));
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetch();
  }, [range?.from, range?.to]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return { bestSellers, loading, error, refetch: fetch };
};
