import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { StockLevel } from '../../../types';
import { getApiErrorMessage } from '../../../services/apiError';

export const useStockLevels = () => {
  const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getStockLevels();
      setStockLevels(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load stock levels.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch(); }, []);

  return { stockLevels, loading, error, refetch: fetch };
};
