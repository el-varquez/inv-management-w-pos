import { useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { getApiErrorMessage } from '../../../services/apiError';

interface AddStockPayload {
  itemId: string;
  quantity: number;
  costPerUnit: number;
  supplierName?: string;
  notes?: string;
}

export const useAddStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStock = async (payload: AddStockPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await inventoryService.addStock(payload);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to add stock.'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addStock, loading, error };
};
