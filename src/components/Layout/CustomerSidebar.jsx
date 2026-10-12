import { NavLink } from 'react-router-dom';

const menuData = [
  {
    category: 'Main',
    items: [
      { name: 'Dashboard', icon: '📊', path: '/customer/dashboard' },
    ],
  },
  {
    category: 'Loans',
    items: [
      { name: 'My Loans', icon: '💰', path: '/customer/my-loans' },
      { name: 'Apply for Loan', icon: '📝', path: '/loan/apply' },
      { name: 'Loan Summary', icon: '📊', path: '/customer/loan-summary' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { name: 'Pay EMI', icon: '💳', path: '/customer/pay-emi' },
      { name: 'Repay Full Loan', icon: '💸', path: '/customer/repay-full' },
      { name: 'Payment History', icon: '📜', path: '/customer/payment-history' },
    ],
  },
  {
    category: 'KYC & Profile',
    items: [
      { name: 'KYC Details', icon: '📋', path: '/customer/kyc' }, // ✅ Updated path
      { name: 'My Profile', icon: '👤', path: '/customer/profile' },
      { name: 'Change Password', icon: '🔒', path: '/customer/change-password' },
    ],
  },
];

const CustomerSidebar = () => {
  return (
    <aside className="w-64 bg-brand-navy text-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto sidebar-scroll flex-shrink-0 hidden md:block">
      <div className="p-4 text-xs text-gray-400 border-b border-gray-700">
        SESSION: 2026-2027
        <div className="mt-1 text-brand-pink text-xs">Customer Portal</div>
      </div>
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
        PNRG FINANCE v2.0
      </div>
    </aside>
  );
};

export default CustomerSidebar;