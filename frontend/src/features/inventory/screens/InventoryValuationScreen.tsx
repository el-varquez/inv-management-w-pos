import { useInventoryValuation } from '../hooks/useInventoryValuation';
import { InventoryTabs } from '../components/InventoryTabs';
import { peso, formatDateTime } from '../../../lib/format';

const SKELETON_ROWS = Array.from({ length: 5 });

export const InventoryValuationScreen = () => {
  const { valuation, loading, error, refetch } = useInventoryValuation();

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Inventory · Report</p>
          <h1 className="page-title">Valuation</h1>
          <p className="page-lead">
            {loading
              ? 'Calculating…'
              : error
                ? 'Could not load valuation.'
                : valuation
                  ? `As of ${formatDateTime(valuation.generatedAt)}`
                  : ''}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={refetch} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <InventoryTabs />

      {valuation && !loading && !error && (
        <div className="stat-row">
          <div className="card stat-card">
            <div className="stat-label">Total stock value</div>
            <div className="stat-value tnum">
              {peso.format(valuation.totalValue)}
            </div>
            <div className="stat-sub">at cost price</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Items valued</div>
            <div className="stat-value tnum">{valuation.totalItems}</div>
            <div className="stat-sub">distinct products</div>
          </div>
        </div>
      )}

      <div className="card table-wrap">
        {error ? (
          <div className="state state-error">
            <div className="state-emoji">⚠️</div>
            <div className="state-title">Something went wrong</div>
            <p className="state-msg">{error}</p>
            <button className="btn btn-ghost" onClick={refetch}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <ValuationTable>
            {SKELETON_ROWS.map((_, i) => (
              <tr key={i}>
                <td>
                  <span className="skeleton" style={{ width: '55%' }} />
                </td>
                <td className="item-sub-cat">
                  <span className="skeleton" style={{ width: 70 }} />
                </td>
                <td className="num">
                  <span className="skeleton" style={{ width: 40, marginLeft: 'auto' }} />
                </td>
                <td className="num">
                  <span className="skeleton" style={{ width: 70, marginLeft: 'auto' }} />
                </td>
                <td className="num">
                  <span className="skeleton" style={{ width: 90, marginLeft: 'auto' }} />
                </td>
              </tr>
            ))}
          </ValuationTable>
        ) : !valuation || valuation.items.length === 0 ? (
          <div className="state">
            <div className="state-emoji">💰</div>
            <div className="state-title">Nothing to value</div>
            <p className="state-msg">Add items and stock to see valuation.</p>
          </div>
        ) : (
          <ValuationTable>
            {valuation.items.map((i) => (
              <tr key={i.itemId}>
                <td>
                  <div className="item-name">{i.itemName}</div>
                </td>
                <td className="item-sub-cat">
                  <span className="cat-pill">{i.categoryName}</span>
                </td>
                <td className="num tnum">{i.stock}</td>
                <td className="num tnum cost">{peso.format(i.costPrice)}</td>
                <td className="num tnum price">{peso.format(i.stockValue)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={4}>Total</td>
              <td className="num tnum price">
                {peso.format(valuation.totalValue)}
              </td>
            </tr>
          </ValuationTable>
        )}
      </div>
    </>
  );
};

const ValuationTable = ({ children }: { children: React.ReactNode }) => (
  <table className="ledger">
    <thead>
      <tr>
        <th>Item</th>
        <th className="item-sub-cat">Category</th>
        <th className="num">Stock</th>
        <th className="num">Cost</th>
        <th className="num">Value</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
