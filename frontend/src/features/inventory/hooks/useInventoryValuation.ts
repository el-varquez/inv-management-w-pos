import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { InventoryValuation } from '../../../types';
import { getApiErrorMessage } from '../../../services/apiError';

export const useInventoryValuation = () => {
  const [valuation, setValuation] = useState<InventoryValuation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getValuation();
      setValuation(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load valuation.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch(); }, []);

  return { valuation, loading, error, refetch: fetch };
};
