export const adminMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/admin/dashboard' }] },
  { category: 'Master', items: [{ name: 'Product Master', icon: '⚙️', path: '/products' }] },
  { category: 'HRM', items: [{ name: 'Employee Leave', icon: '👥', path: '/leave' }, { name: 'Attendance', icon: '📋', path: '/attendance' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }, { name: 'Groups', icon: '🏢', path: '/groups' }] },
  { category: 'Loans', items: [{ name: 'Apply for Loan', icon: '💰', path: '/loan/apply' }, { name: 'Disbursement', icon: '💸', path: '/loan/disburse' }, { name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Approvals', items: [{ name: 'Loan Approval', icon: '✅', path: '/approvals/loan' }, { name: 'Salary Approval', icon: '✅', path: '/approvals/salary' }] },
  { category: 'Collections', items: [{ name: 'Member Collection', icon: '📥', path: '/collection/member' }, { name: 'Promise to Pay', icon: '🤝', path: '/collection/promise' }] },
  { category: 'CIBIL', items: [{ name: 'CIBIL Reporting', icon: '📋', path: '/cibil/report' }] },
  { category: 'Accounting', items: [{ name: 'Voucher', icon: '📒', path: '/accounting/voucher' }, { name: 'Profit-Loss', icon: '📊', path: '/accounting/pl' }, { name: 'Ledger', icon: '📘', path: '/accounting/ledger' }] },
  { category: 'Settings', items: [{ name: 'Role & Permission', icon: '🛠️', path: '/settings/roles' }, { name: 'SMS Testing', icon: '📱', path: '/settings/sms' }] },
];

export const managerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/manager/dashboard' }] },
  { category: 'Loans', items: [{ name: 'Apply for Loan', icon: '💰', path: '/loan/apply' }, { name: 'Disbursement', icon: '💸', path: '/loan/disburse' }, { name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Approvals', items: [{ name: 'Loan Approval', icon: '✅', path: '/approvals/loan' }] },
  { category: 'Collections', items: [{ name: 'Member Collection', icon: '📥', path: '/collection/member' }] },
  { category: 'Reports', items: [{ name: 'Profit & Loss', icon: '📊', path: '/accounting/pl' }, { name: 'Ledger', icon: '📘', path: '/accounting/ledger' }] },
];

export const fieldOfficerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/field-officer/dashboard' }] },
  { category: 'KYC', items: [{ name: 'Verify KYC', icon: '📋', path: '/field-officer/kyc' }] },
  { category: 'Collections', items: [{ name: 'Collect EMI', icon: '💰', path: '/field-officer/collections' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }] },
  { category: 'Reports', items: [{ name: 'Reports', icon: '📊', path: '/field-officer/reports' }] },
];

export const staffMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/staff/dashboard' }] },
  { category: 'Loans', items: [{ name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }] },
];

export const customerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/customer/dashboard' }] },
  { category: 'Loans', items: [{ name: 'My Loans', icon: '💰', path: '/customer/my-loans' }, { name: 'Apply for Loan', icon: '📝', path: '/loan/apply' }, { name: 'Loan Summary', icon: '📊', path: '/customer/loan-summary' }] },
  { category: 'Payments', items: [{ name: 'Pay EMI', icon: '💳', path: '/customer/pay-emi' }, { name: 'Payment History', icon: '📜', path: '/customer/payment-history' }] },
  { category: 'KYC & Profile', items: [{ name: 'KYC Details', icon: '📋', path: '/customer/kyc' }, { name: 'My Profile', icon: '👤', path: '/customer/profile' }, { name: 'Change Password', icon: '🔒', path: '/customer/change-password' }] },
];