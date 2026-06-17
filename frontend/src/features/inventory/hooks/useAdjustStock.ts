import { useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { getApiErrorMessage } from '../../../services/apiError';

interface AdjustStockPayload {
  itemId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export const useAdjustStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adjustStock = async (payload: AdjustStockPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await inventoryService.adjustStock(payload);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to adjust stock.'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { adjustStock, loading, error };
};
