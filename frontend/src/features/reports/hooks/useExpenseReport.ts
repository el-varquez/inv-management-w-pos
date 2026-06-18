import { useEffect, useState } from 'react';
import { reportsService, type DateRange } from '../services/reportsService';
import { getApiErrorMessage } from '../../../services/apiError';
import type { ExpenseReport } from '../../../types';

export const useExpenseReport = (range?: DateRange) => {
  const [report, setReport] = useState<ExpenseReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getExpenseReport(range);
      setReport(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load expense report.'));
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetch();
  }, [range?.from, range?.to]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  return { report, loading, error, refetch: fetch };
};
