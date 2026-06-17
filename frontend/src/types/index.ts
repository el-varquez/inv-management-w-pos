export interface Item {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
}

export interface LoginResult {
  token: string;
  name: string;
  email: string;
  role: string;
}

// ── Inventory (Phase 2) ────────────────────────────────────────

export interface StockLevel {
  itemId: string;
  itemName: string;
  categoryName: string;
  stock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  costPrice: number;
  sellingPrice: number;
  stockValue: number;
}

export interface InventoryHistoryItem {
  id: string;
  itemId: string;
  itemName: string;
  categoryName: string;
  movementType: string;
  quantity: number;
  costPerUnit?: number;
  totalCost?: number;
  supplierName?: string;
  reason?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryValuationItem {
  itemId: string;
  itemName: string;
  categoryName: string;
  stock: number;
  costPrice: number;
  stockValue: number;
}

export interface InventoryValuation {
  items: InventoryValuationItem[];
  totalValue: number;
  totalItems: number;
  generatedAt: string;
}

export interface LowStockItem {
  itemId: string;
  itemName: string;
  categoryName: string;
  stock: number;
  lowStockThreshold: number;
  deficit: number;
}

export interface InventoryCountLine {
  itemId: string;
  itemName: string;
  categoryName: string;
  expectedQty: number;
  actualQty: number;
  variance: number;
}

export interface InventoryCount {
  id: string;
  reference: string;
  notes?: string;
  status: 'Draft' | 'Completed';
  completedAt?: string;
  createdAt: string;
  lines: InventoryCountLine[];
}

// Enum string values mirror the backend enums (serialized as names).
export type AdjustmentReason =
  | 'Damage'
  | 'Loss'
  | 'Spoilage'
  | 'Correction'
  | 'Other';

export type StockMovementType =
  | 'AddStock'
  | 'Sale'
  | 'Adjustment'
  | 'InventoryCount'
  | 'Return';