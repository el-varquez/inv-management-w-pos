import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/inventory/stock-levels', label: 'Stock levels' },
  { to: '/inventory/low-stock', label: 'Low stock' },
  { to: '/inventory/count', label: 'Stocktake' },
  { to: '/inventory/history', label: 'History' },
  { to: '/inventory/valuation', label: 'Valuation' },
];

export const InventoryTabs = () => (
  <div className="subnav">
    {tabs.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        className={({ isActive }) =>
          isActive ? 'subnav-link is-active' : 'subnav-link'
        }
      >
        {tab.label}
      </NavLink>
    ))}
  </div>
);
