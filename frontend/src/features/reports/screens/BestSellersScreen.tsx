import { useState } from 'react';
import { useBestSellers } from '../hooks/useBestSellers';
import { useDateRange } from '../hooks/useDateRange';
import { ReportsTabs } from '../components/ReportsTabs';
import { DateRangeControls } from '../components/DateRangeControls';
import { Pagination } from '../../../components/Pagination';
import { DEFAULT_PAGE_SIZE } from '../../../lib/pagination';
import { peso } from '../../../lib/format';

const SKELETON_ROWS = Array.from({ length: 6 });

export const BestSellersScreen = () => {
  const {
    preset,
    setPreset,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    range,
  } = useDateRange('month');
  const { bestSellers, loading, error, refetch } = useBestSellers(range);

  const pageSize = DEFAULT_PAGE_SIZE;
  const [page, setPage] = useState(1);

  const rangeKey = `${range.from ?? ''}|${range.to ?? ''}`;
  const [prevRangeKey, setPrevRangeKey] = useState(rangeKey);
  if (rangeKey !== prevRangeKey) {
    setPrevRangeKey(rangeKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(bestSellers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;
  const pageRows = bestSellers.slice(offset, offset + pageSize);

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Reports · Best sellers</p>
          <h1 className="page-title">Best sellers</h1>
          <p className="page-lead">
            {loading
              ? 'Ranking your products…'
              : error
                ? 'Could not load best sellers.'
                : `${bestSellers.length} product${
                    bestSellers.length === 1 ? '' : 's'
                  } sold in the selected period`}
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
          <div className="card table-wrap">
            {loading ? (
              <BestSellersTable>
                {SKELETON_ROWS.map((_, i) => (
                  <tr key={i}>
                    <td className="num">
                      <span className="skeleton" style={{ width: 20, marginLeft: 'auto' }} />
                    </td>
                    <td>
                      <span className="skeleton" style={{ width: '55%' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 36, marginLeft: 'auto' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 70, marginLeft: 'auto' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 70, marginLeft: 'auto' }} />
                    </td>
                    <td className="num">
                      <span className="skeleton" style={{ width: 50, marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))}
              </BestSellersTable>
            ) : bestSellers.length === 0 ? (
              <div className="state">
                <div className="state-emoji">🏆</div>
                <div className="state-title">No sales in this period</div>
                <p className="state-msg">
                  Your top-selling products will appear here once you ring up sales.
                </p>
              </div>
            ) : (
              <BestSellersTable>
                {pageRows.map((b, i) => (
                  <tr key={b.itemId}>
                    <td className="num tnum rank-cell">{offset + i + 1}</td>
                    <td>
                      <div className="item-name">{b.itemName}</div>
                    </td>
                    <td className="num tnum">{b.quantitySold}</td>
                    <td className="num tnum">{peso.format(b.revenue)}</td>
                    <td
                      className={`num tnum ${b.profit < 0 ? 'text-red' : 'price'}`}
                      style={{ fontWeight: 600 }}
                    >
                      {peso.format(b.profit)}
                    </td>
                    <td className="num tnum">{b.marginPercent}%</td>
                  </tr>
                ))}
              </BestSellersTable>
            )}
          </div>

          {!loading && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={bestSellers.length}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
};

const BestSellersTable = ({ children }: { children: React.ReactNode }) => (
  <table className="ledger">
    <thead>
      <tr>
        <th className="num">#</th>
        <th>Item</th>
        <th className="num">Qty sold</th>
        <th className="num">Revenue</th>
        <th className="num">Profit</th>
        <th className="num">Margin</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);
