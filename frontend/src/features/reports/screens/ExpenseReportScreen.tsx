import { useState } from 'react';
import { useExpenseReport } from '../hooks/useExpenseReport';
import { useDateRange } from '../hooks/useDateRange';
import { ReportsTabs } from '../components/ReportsTabs';
import { DateRangeControls } from '../components/DateRangeControls';
import { Pagination } from '../../../components/Pagination';
import { DEFAULT_PAGE_SIZE } from '../../../lib/pagination';
import { peso, formatDate } from '../../../lib/format';

const SKELETON_ROWS = Array.from({ length: 5 });

export const ExpenseReportScreen = () => {
  const {
    preset,
    setPreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    range,
  } = useDateRange('month');
  const { report, loading, error, refetch } = useExpenseReport(range);

  const purchases = report?.purchases ?? [];
  const pageSize = DEFAULT_PAGE_SIZE;
  const [page, setPage] = useState(1);

  const rangeKey = `${range.from ?? ''}|${range.to ?? ''}`;
  const [prevRangeKey, setPrevRangeKey] = useState(rangeKey);
  if (rangeKey !== prevRangeKey) {
    setPrevRangeKey(rangeKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(purchases.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = purchases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Reports · Expenses</p>
          <h1 className="page-title">Expense report</h1>
          <p className="page-lead">
            {loading
              ? 'Crunching the numbers…'
              : error
                ? 'Could not load the expense report.'
                : `${purchases.length} restock${
                    purchases.length === 1 ? '' : 's'
                  } in the selected period`}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={refetch} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <ReportsTabs />

      <DateRangeControls
        preset={preset}
        setPreset={setPreset}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
      />

      {error ? (
        <div className="card table-wrap">
          <div className="state state-error">
            <div className="state-emoji">⚠️</div>
            <div className="state-title">Something went wrong</div>
            <p className="state-msg">{error}</p>
            <button className="btn btn-ghost" onClick={refetch}>
              Try again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="stat-row">
            <div className="card stat-card">
              <div className="stat-label">Cost of purchases</div>
              <div className="stat-value tnum">
                {peso.format(report?.costOfPurchases ?? 0)}
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Inventory loss</div>
              <div className="stat-value tnum">
                {peso.format(report?.inventoryLoss ?? 0)}
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Total expenses</div>
              <div className="stat-value tnum">
                {peso.format(report?.totalExpenses ?? 0)}
              </div>
            </div>
          </div>

          <div className="card table-wrap">
            {loading ? (
              <PurchasesTable>
                {SKELETON_ROWS.map((_, i) => (
                  <tr key={i}>
                    <td>
                      <span className="skeleton" style={{ width: 110 }} />
                    </td>
                    <td>
                      <span className="skeleton" style={{ width: '60%' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 30, marginLeft: 'auto' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 70, marginLeft: 'auto' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 80, marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))}
              </PurchasesTable>
            ) : purchases.length === 0 ? (
              <div className="state">
                <div className="state-emoji">🧾</div>
                <div className="state-title">No expenses in this period</div>
                <p className="state-msg">
                  Restocks and inventory losses in this range will show here.
                </p>
              </div>
            ) : (
              <PurchasesTable>
                {pageRows.map((p, i) => (
                  <tr key={`${p.date}-${p.itemName}-${i}`}>
                    <td className="item-sub">{formatDate(p.date)}</td>
                    <td>
                      <div className="item-name">{p.itemName}</div>
                      <div className="item-sub">{p.supplierName ?? '—'}</div>
                    </td>
                    <td className="num tnum">{p.quantity}</td>
                    <td className="num tnum cost">{peso.format(p.costPerUnit)}</td>
                    <td className="num tnum price" style={{ fontWeight: 600 }}>
                      {peso.format(p.totalCost)}
                    </td>
                  </tr>
                ))}
              </PurchasesTable>
            )}
          </div>

          {!loading && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={purchases.length}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
};

const PurchasesTable = ({ children }: { children: React.ReactNode }) => (
  <table className="ledger">
    <thead>
      <tr>
        <th>Date</th>
        <th>Item / supplier</th>
        <th className="num">Qty</th>
        <th className="num">Cost / unit</th>
        <th className="num">Total cost</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
