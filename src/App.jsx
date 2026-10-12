import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerMyLoans from './pages/CustomerMyLoans';
import CustomerLoanDetails from './pages/CustomerLoanDetails'; // ✅ NEW
import CustomerLoanSummary from './pages/CustomerLoanSummary';
import CustomerPayEMI from './pages/CustomerPayEMI';
import CustomerFullRepayment from './pages/CustomerFullRepayment';
import CustomerPaymentHistory from './pages/CustomerPaymentHistory';
import CustomerKycDetails from './pages/CustomerKycDetails';
import CustomerProfile from './pages/CustomerProfile';
import CustomerChangePassword from './pages/CustomerChangePassword';
import ManagerDashboard from './pages/ManagerDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Members from './pages/Members';
import ProductMaster from './pages/ProductMaster';
import EmployeeLeave from './pages/EmployeeLeave';
import Attendance from './pages/Attendance';
import Groups from './pages/Groups';
import ApplyLoan from './pages/ApplyLoan';
import Disbursement from './pages/Disbursement';
import LoanSummary from './pages/LoanSummary';
import EMIRecords from './pages/EMIRecords';
import LoanApproval from './pages/LoanApproval';
import SalaryApproval from './pages/SalaryApproval';
import MemberCollection from './pages/MemberCollection';
import PromiseToPay from './pages/PromiseToPay';
import CibilReporting from './pages/CibilReporting';
import Voucher from './pages/Voucher';
import ProfitLoss from './pages/ProfitLoss';
import Ledger from './pages/Ledger';
import RolePermission from './pages/RolePermission';
import SmsTesting from './pages/SmsTesting';
import Branches from './pages/Branches';
import UserManagement from './pages/UserManagement';
import RoleLayout from './components/Layout/RoleLayout';

const UnderConstruction = ({ title }) => (
  <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow p-8">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-brand-navy mb-2">{title}</h2>
      <p className="text-gray-500">This page is under construction. Coming soon!</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = (user?.role || 'CUSTOMER').toUpperCase();
  const roleMap = {
    ADMIN: '/admin/dashboard',
    MANAGER: '/manager/dashboard',
    FIELD_OFFICER: '/field-officer/dashboard',
    STAFF: '/staff/dashboard',
    CUSTOMER: '/customer/dashboard',
  };
  const redirectPath = roleMap[role] || '/customer/dashboard';
  return <Navigate to={redirectPath} replace />;
};

// ─── Menu Definitions ──────────────────────────────────────────
const adminMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/admin/dashboard' }] },
  { category: 'Master', items: [{ name: 'Product Master', icon: '⚙️', path: '/products' }] },
  { category: 'HRM', items: [{ name: 'Employee Leave', icon: '👥', path: '/leave' }, { name: 'Attendance', icon: '📋', path: '/attendance' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }, { name: 'Groups', icon: '🏢', path: '/groups' }] },
  { category: 'Loans', items: [{ name: 'Apply for Loan', icon: '💰', path: '/loan/apply' }, { name: 'Disbursement', icon: '💸', path: '/loan/disburse' }, { name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Approvals', items: [{ name: 'Loan Approval', icon: '✅', path: '/approvals/loan' }, { name: 'Salary Approval', icon: '✅', path: '/approvals/salary' }] },
  { category: 'Collections', items: [{ name: 'Member Collection', icon: '📥', path: '/collection/member' }, { name: 'Promise to Pay', icon: '🤝', path: '/collection/promise' }] },
  { category: 'CIBIL', items: [{ name: 'CIBIL Reporting', icon: '📋', path: '/cibil/report' }] },
  { category: 'Accounting', items: [{ name: 'Voucher', icon: '📒', path: '/accounting/voucher' }, { name: 'Profit-Loss', icon: '📊', path: '/accounting/pl' }, { name: 'Ledger', icon: '📘', path: '/accounting/ledger' }] },
  { category: 'Settings', items: [
    { name: 'Branches', icon: '🏢', path: '/branches' },
    { name: 'User Management', icon: '👥', path: '/users' },
    { name: 'Role & Permission', icon: '🛠️', path: '/settings/roles' },
    { name: 'SMS Testing', icon: '📱', path: '/settings/sms' }
  ] },
];

const managerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/manager/dashboard' }] },
  { category: 'Loans', items: [{ name: 'Apply for Loan', icon: '💰', path: '/loan/apply' }, { name: 'Disbursement', icon: '💸', path: '/loan/disburse' }, { name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Approvals', items: [{ name: 'Loan Approval', icon: '✅', path: '/approvals/loan' }] },
  { category: 'Collections', items: [{ name: 'Member Collection', icon: '📥', path: '/collection/member' }] },
  { category: 'Reports', items: [{ name: 'Profit & Loss', icon: '📊', path: '/accounting/pl' }, { name: 'Ledger', icon: '📘', path: '/accounting/ledger' }] },
];

const fieldOfficerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/field-officer/dashboard' }] },
  { category: 'KYC', items: [{ name: 'Verify KYC', icon: '📋', path: '/field-officer/kyc' }] },
  { category: 'Collections', items: [{ name: 'Collect EMI', icon: '💰', path: '/field-officer/collections' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }] },
  { category: 'Reports', items: [{ name: 'Reports', icon: '📊', path: '/field-officer/reports' }] },
];

const staffMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/staff/dashboard' }] },
  { category: 'Loans', items: [{ name: 'Loan Summary', icon: '📊', path: '/loan/summary' }] },
  { category: 'Members', items: [{ name: 'Member List', icon: '👤', path: '/members' }] },
];

const customerMenu = [
  { category: 'Main', items: [{ name: 'Dashboard', icon: '📊', path: '/customer/dashboard' }] },
  { category: 'Loans', items: [
    { name: 'My Loans', icon: '💰', path: '/customer/my-loans' },
    { name: 'Apply for Loan', icon: '📝', path: '/loan/apply' },
    { name: 'Loan Summary', icon: '📊', path: '/customer/loan-summary' }
  ] },
  { category: 'Payments', items: [
    { name: 'Pay EMI', icon: '💳', path: '/customer/pay-emi' },
    { name: 'Repay Full Loan', icon: '💸', path: '/customer/repay-full' },
    { name: 'Payment History', icon: '📜', path: '/customer/payment-history' }
  ] },
  { category: 'KYC & Profile', items: [
    { name: 'KYC Details', icon: '📋', path: '/customer/kyc' },
    { name: 'My Profile', icon: '👤', path: '/customer/profile' },
    { name: 'Change Password', icon: '🔒', path: '/customer/change-password' }
  ] },
];

// ─── Dynamic Layout for Shared Pages ──────────────────────────
const DynamicRouteWithLayout = ({ Component, menuMap }) => {
  const { user } = useAuth();
  const role = (user?.role || 'CUSTOMER').toUpperCase();
  const menu = menuMap[role] || customerMenu;
  const roleName = role.charAt(0) + role.slice(1).toLowerCase();
  return (
    <RoleLayout menuData={menu} roleName={roleName}>
      <Component />
    </RoleLayout>
  );
};

function App() {
  const menuMap = {
    ADMIN: adminMenu,
    MANAGER: managerMenu,
    FIELD_OFFICER: fieldOfficerMenu,
    STAFF: staffMenu,
    CUSTOMER: customerMenu,
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* ─── PUBLIC ───────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ─── ROLE‑BASED REDIRECT ────────────────────────── */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />

        {/* ─── ADMIN ROUTES ────────────────────────────────── */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Dashboard /></RoleLayout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><ProductMaster /></RoleLayout></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Members /></RoleLayout></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><EmployeeLeave /></RoleLayout></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Attendance /></RoleLayout></ProtectedRoute>} />
        <Route path="/groups" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Groups /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/apply" element={<ProtectedRoute><DynamicRouteWithLayout Component={ApplyLoan} menuMap={menuMap} /></ProtectedRoute>} />
        <Route path="/loan/disburse" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Disbursement /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/summary" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><LoanSummary /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/emi" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><EMIRecords /></RoleLayout></ProtectedRoute>} />
        <Route path="/approvals/loan" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><LoanApproval /></RoleLayout></ProtectedRoute>} />
        <Route path="/approvals/salary" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><SalaryApproval /></RoleLayout></ProtectedRoute>} />
        <Route path="/collection/member" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><MemberCollection /></RoleLayout></ProtectedRoute>} />
        <Route path="/collection/promise" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><PromiseToPay /></RoleLayout></ProtectedRoute>} />
        <Route path="/cibil/report" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><CibilReporting /></RoleLayout></ProtectedRoute>} />
        <Route path="/accounting/voucher" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Voucher /></RoleLayout></ProtectedRoute>} />
        <Route path="/accounting/pl" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><ProfitLoss /></RoleLayout></ProtectedRoute>} />
        <Route path="/accounting/ledger" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Ledger /></RoleLayout></ProtectedRoute>} />
        <Route path="/branches" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><Branches /></RoleLayout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><UserManagement /></RoleLayout></ProtectedRoute>} />
        <Route path="/settings/roles" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><RolePermission /></RoleLayout></ProtectedRoute>} />
        <Route path="/settings/sms" element={<ProtectedRoute><RoleLayout menuData={adminMenu} roleName="Admin"><SmsTesting /></RoleLayout></ProtectedRoute>} />

        {/* ─── MANAGER ROUTES ────────────────────────────────── */}
        <Route path="/manager/dashboard" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><ManagerDashboard /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/disburse" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><Disbursement /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/summary" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><LoanSummary /></RoleLayout></ProtectedRoute>} />
        <Route path="/approvals/loan" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><LoanApproval /></RoleLayout></ProtectedRoute>} />
        <Route path="/collection/member" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><MemberCollection /></RoleLayout></ProtectedRoute>} />
        <Route path="/accounting/pl" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><ProfitLoss /></RoleLayout></ProtectedRoute>} />
        <Route path="/accounting/ledger" element={<ProtectedRoute><RoleLayout menuData={managerMenu} roleName="Manager"><Ledger /></RoleLayout></ProtectedRoute>} />

        {/* ─── FIELD OFFICER ROUTES ────────────────────────── */}
        <Route path="/field-officer/dashboard" element={<ProtectedRoute><RoleLayout menuData={fieldOfficerMenu} roleName="Field Officer"><FieldOfficerDashboard /></RoleLayout></ProtectedRoute>} />
        <Route path="/field-officer/kyc" element={<ProtectedRoute><RoleLayout menuData={fieldOfficerMenu} roleName="Field Officer"><UnderConstruction title="KYC Verification" /></RoleLayout></ProtectedRoute>} />
        <Route path="/field-officer/collections" element={<ProtectedRoute><RoleLayout menuData={fieldOfficerMenu} roleName="Field Officer"><UnderConstruction title="Collections" /></RoleLayout></ProtectedRoute>} />
        <Route path="/field-officer/reports" element={<ProtectedRoute><RoleLayout menuData={fieldOfficerMenu} roleName="Field Officer"><UnderConstruction title="Reports" /></RoleLayout></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><RoleLayout menuData={fieldOfficerMenu} roleName="Field Officer"><Members /></RoleLayout></ProtectedRoute>} />

        {/* ─── STAFF ROUTES ────────────────────────────────── */}
        <Route path="/staff/dashboard" element={<ProtectedRoute><RoleLayout menuData={staffMenu} roleName="Staff"><StaffDashboard /></RoleLayout></ProtectedRoute>} />
        <Route path="/loan/summary" element={<ProtectedRoute><RoleLayout menuData={staffMenu} roleName="Staff"><LoanSummary /></RoleLayout></ProtectedRoute>} />
        <Route path="/members" element={<ProtectedRoute><RoleLayout menuData={staffMenu} roleName="Staff"><Members /></RoleLayout></ProtectedRoute>} />

        {/* ─── CUSTOMER ROUTES ────────────────────────────────── */}
        <Route path="/customer/dashboard" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerDashboard /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/my-loans" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerMyLoans /></RoleLayout></ProtectedRoute>} />
        {/* ✅ NEW: Loan details page */}
        <Route path="/customer/loan-details/:loanId" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerLoanDetails /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/loan-summary" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerLoanSummary /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/pay-emi" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerPayEMI /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/repay-full" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerFullRepayment /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/payment-history" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerPaymentHistory /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/kyc" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerKycDetails /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/profile" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerProfile /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/change-password" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><CustomerChangePassword /></RoleLayout></ProtectedRoute>} />
        <Route path="/customer/my-applications" element={<ProtectedRoute><RoleLayout menuData={customerMenu} roleName="Customer"><UnderConstruction title="My Applications" /></RoleLayout></ProtectedRoute>} />

        {/* ─── CATCH‑ALL ────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;