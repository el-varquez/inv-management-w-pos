import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { useAddStock } from '../hooks/useAddStock';
import { peso } from '../../../lib/format';
import type { StockLevel } from '../../../types';

interface Props {
  item: StockLevel;
  onClose: () => void;
  onDone: () => void;
}

export const AddStockModal = ({ item, onClose, onDone }: Props) => {
  const { addStock, loading, error } = useAddStock();
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState(String(item.costPrice));
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');

  const qty = Number(quantity);
  const cost = Number(costPerUnit);
  const total = qty > 0 && cost >= 0 ? qty * cost : 0;
  const canSubmit = qty > 0 && cost >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const ok = await addStock({
      itemId: item.itemId,
      quantity: qty,
      costPerUnit: cost,
      supplierName: supplierName.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    if (ok) onDone();
  };

  return (
    <Modal
      title="Add stock"
      subtitle={`${item.itemName} · ${item.stock} on hand`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="login-error" role="alert">
            <span aria-hidden="true">⚠</span>
            {error}
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="qty">Quantity received</label>
            <input
              id="qty"
              className="input"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="field">
            <label htmlFor="cost">Cost per unit</label>
            <input
              id="cost"
              className="input"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="supplier">Supplier (optional)</label>
          <input
            id="supplier"
            className="input"
            type="text"
            placeholder="e.g. Nestlé Distributor"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="notes">Notes (optional)</label>
          <input
            id="notes"
            className="input"
            type="text"
            placeholder="Delivery reference, batch, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-summary">
          <span>Total cost (recorded as expense)</span>
          <strong className="tnum">{peso.format(total)}</strong>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !canSubmit}
          >
            {loading ? <span className="spinner" aria-hidden="true" /> : null}
            {loading ? 'Saving…' : 'Add stock'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
