import { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import type { LowStockItem } from '../../../types';
import { getApiErrorMessage } from '../../../services/apiError';

export const useLowStock = () => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryService.getLowStock();
      setItems(data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load low stock items.'));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch(); }, []);

  return { items, loading, error, refetch: fetch };
};
