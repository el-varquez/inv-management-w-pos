import { useLowStock } from '../hooks/useLowStock';
import { InventoryTabs } from '../components/InventoryTabs';

const SKELETON_ROWS = Array.from({ length: 4 });

export const LowStockScreen = () => {
  const { items, loading, error, refetch } = useLowStock();

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Inventory · Alerts</p>
          <h1 className="page-title">Low stock</h1>
          <p className="page-lead">
            {loading
              ? 'Checking stock…'
              : error
                ? 'Could not load low stock items.'
                : items.length === 0
                  ? 'Everything is above its threshold.'
                  : `${items.length} item${items.length === 1 ? '' : 's'} need restocking`}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={refetch} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <InventoryTabs />

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
          <LowStockTable>
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
                  <span className="skeleton" style={{ width: 40, marginLeft: 'auto' }} />
                </td>
                <td className="num">
                  <span className="skeleton" style={{ width: 60, marginLeft: 'auto' }} />
                </td>
              </tr>
            ))}
          </LowStockTable>
        ) : items.length === 0 ? (
          <div className="state">
            <div className="state-emoji">✅</div>
            <div className="state-title">All good</div>
            <p className="state-msg">
              No items are below their low-stock threshold right now.
            </p>
          </div>
        ) : (
          <LowStockTable>
            {items.map((i) => (
              <tr key={i.itemId}>
                <td>
                  <div className="item-name">{i.itemName}</div>
                </td>
                <td className="item-sub-cat">
                  <span className="cat-pill">{i.categoryName}</span>
                </td>
                <td className="num">
                  <span className="stock-num tnum">{i.stock}</span>
                </td>
                <td className="num tnum cost">{i.lowStockThreshold}</td>
                <td className="num">
                  <span className="badge badge-low">−{i.deficit}</span>
                </td>
              </tr>
            ))}
          </LowStockTable>
        )}
      </div>
    </>
  );
};

const LowStockTable = ({ children }: { children: React.ReactNode }) => (
  <table className="ledger">
    <thead>
      <tr>
        <th>Item</th>
        <th className="item-sub-cat">Category</th>
        <th className="num">On hand</th>
        <th className="num">Threshold</th>
        <th className="num">Short by</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
