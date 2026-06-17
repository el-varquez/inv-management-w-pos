import api from '../../../services/api';
import type {
  StockLevel,
  InventoryHistoryItem,
  InventoryValuation,
  LowStockItem,
} from '../../../types';

export const inventoryService = {
  // ── Stock levels ──────────────────────────────────────────
  getStockLevels: async (): Promise<StockLevel[]> => {
    const { data } = await api.get<StockLevel[]>('/inventory/stock-levels');
    return data;
  },

  getLowStock: async (): Promise<LowStockItem[]> => {
    const { data } = await api.get<LowStockItem[]>('/inventory/low-stock');
    return data;
  },

  // ── Stock actions ─────────────────────────────────────────
  addStock: async (payload: {
    itemId: string;
    quantity: number;
    costPerUnit: number;
    supplierName?: string;
    notes?: string;
  }): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>(
      '/inventory/add-stock',
      payload
    );
    return data;
  },

  adjustStock: async (payload: {
    itemId: string;
    quantity: number;
    reason: string;
    notes?: string;
  }): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>(
      '/inventory/adjust-stock',
      payload
    );
    return data;
  },

  // ── Inventory count ───────────────────────────────────────
  createCount: async (notes?: string): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>('/inventory/count', {
      notes,
    });
    return data;
  },

  completeCount: async (
    countId: string,
    lines: { itemId: string; actualQty: number }[]
  ): Promise<void> => {
    await api.post(`/inventory/count/${countId}/complete`, lines);
  },

  // ── Composite items ───────────────────────────────────────
  setComponents: async (
    itemId: string,
    components: { componentItemId: string; quantity: number }[]
  ): Promise<void> => {
    await api.post(`/inventory/items/${itemId}/components`, components);
  },

  // ── Reports ───────────────────────────────────────────────
  getHistory: async (params?: {
    from?: string;
    to?: string;
    type?: string;
  }): Promise<InventoryHistoryItem[]> => {
    const { data } = await api.get<InventoryHistoryItem[]>(
      '/inventory/history',
      { params }
    );
    return data;
  },

  getValuation: async (): Promise<InventoryValuation> => {
    const { data } = await api.get<InventoryValuation>('/inventory/valuation');
    return data;
  },
};
