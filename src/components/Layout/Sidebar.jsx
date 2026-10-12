import { NavLink } from 'react-router-dom';

const menuData = [
  {
    category: 'Main',
    items: [{ name: 'Dashboard', icon: '📊', path: '/' }],
  },
  {
    category: 'Master',
    items: [{ name: 'Product Master', icon: '⚙️', path: '/products' }],
  },
  {
    category: 'HRM',
    items: [
      { name: 'Employee Leave', icon: '👥', path: '/leave' },
      { name: 'Attendance', icon: '📋', path: '/attendance' },
    ],
  },
  {
    category: 'Members',
    items: [
      { name: 'Member List', icon: '👤', path: '/members' },
      { name: 'Groups', icon: '🏢', path: '/groups' },
    ],
  },
  {
    category: 'Loans',
    items: [
      { name: 'Apply for Loan', icon: '💰', path: '/loan/apply' },
      { name: 'Disbursement', icon: '💸', path: '/loan/disburse' },
      { name: 'Loan Summary', icon: '📊', path: '/loan/summary' },
      { name: 'EMI Records', icon: '📆', path: '/loan/emi' },
    ],
  },
  {
    category: 'Approvals',
    items: [
      { name: 'Loan Approval', icon: '✅', path: '/approvals/loan' },
      { name: 'Salary Approval', icon: '✅', path: '/approvals/salary' },
    ],
  },
  {
    category: 'Collections',
    items: [
      { name: 'Member Collection', icon: '📥', path: '/collection/member' },
      { name: 'Promise to Pay', icon: '🤝', path: '/collection/promise' },
    ],
  },
  {
    category: 'CIBIL',
    items: [{ name: 'CIBIL Reporting', icon: '📋', path: '/cibil/report' }],
  },
  {
    category: 'Accounting',
    items: [
      { name: 'Voucher', icon: '📒', path: '/accounting/voucher' },
      { name: 'Profit-Loss', icon: '📊', path: '/accounting/pl' },
      { name: 'Ledger', icon: '📘', path: '/accounting/ledger' },
    ],
  },
  {
    category: 'Settings',
    items: [
      { name: 'Role & Permission', icon: '🛠️', path: '/settings/roles' },
      { name: 'SMS Testing', icon: '📱', path: '/settings/sms' },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-brand-navy text-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto sidebar-scroll flex-shrink-0 block">
      <div className="p-4 text-xs text-gray-400 border-b border-gray-700">SESSION: 2026-2027</div>
      {menuData.map((section) => (
        <div key={section.category}>
          <div className="px-4 pt-4 pb-1 text-xs font-bold text-brand-orange uppercase tracking-wider">
            {section.category}
          </div>
          {section.items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm hover:bg-blue-900/50 transition border-l-3 ${
                  isActive
                    ? 'bg-blue-900/50 border-l-4 border-brand-pink'
                    : 'border-transparent'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span> {item.name}
            </NavLink>
          ))}
        </div>
      ))}
      <div className="p-4 text-xs text-gray-500 border-t border-gray-700 mt-4">
        PNRG FINANCE v1.0
      </div>
    </aside>
  );
};

export default Sidebar;