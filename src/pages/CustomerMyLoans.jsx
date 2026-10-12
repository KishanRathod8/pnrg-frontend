import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerMyLoans = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    totalOutstanding: 0,
  });
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/loans');
      const loanData = res.data || [];
      setLoans(loanData);
      // Compute stats
      const total = loanData.length;
      const active = loanData.filter(l => l.status === 'active' || l.status === 'disbursed').length;
      const disbursed = loanData.reduce((sum, l) => sum + (l.amount || 0), 0);
      const outstanding = loanData.reduce((sum, l) => sum + (l.outstandingPrincipal || 0), 0);
      setStats({ totalLoans: total, activeLoans: active, totalDisbursed: disbursed, totalOutstanding: outstanding });
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      toast.error('Could not load your loans. Please try again.');
      setLoans([]);
      setStats({ totalLoans: 0, activeLoans: 0, totalDisbursed: 0, totalOutstanding: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      settled: 'bg-purple-100 text-purple-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ─── Navigation helper ──────────────────────────────────────
  const handleNavigate = (path) => {
    navigate(path);
  };

  // ─── View loan details ──────────────────────────────────────
  const handleView = (loanId) => {
    // Navigate to a loan details page (we'll create a placeholder)
    // or show a modal. For now, navigate to a details page.
    navigate(`/customer/loan-details/${loanId}`);
  };

  // ─── Repay full loan ─────────────────────────────────────────
  const handleRepayFull = async (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    const confirmMsg = `Are you sure you want to repay the full outstanding amount of ${formatCurrency(loan.outstandingPrincipal)} for loan ${loan.loanId}?`;
    if (!window.confirm(confirmMsg)) return;
    setProcessing(loanId);
    try {
      await api.post('/customer/repay-full', { loanId });
      toast.success('Loan fully repaid!');
      fetchMyLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to repay loan');
    } finally {
      setProcessing(null);
    }
  };

  // ─── Apply for loan ──────────────────────────────────────────
  const handleApply = () => {
    navigate('/loan/apply');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading your loans...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">My Loans</h1>
        <button
          onClick={handleApply}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Apply for Loan
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Total Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.totalLoans}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Active Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.activeLoans}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase">Total Disbursed</p>
          <p className="text-2xl font-bold text-brand-navy">{formatCurrency(stats.totalDisbursed)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 uppercase">Outstanding</p>
          <p className="text-2xl font-bold text-brand-navy">{formatCurrency(stats.totalOutstanding)}</p>
        </div>
      </div>

      {/* Loan List */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>You haven't applied for any loans yet.</p>
            <button
              onClick={handleApply}
              className="mt-2 text-brand-pink hover:underline"
            >
              Apply for your first loan →
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Loan ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">EMI</th>
                <th className="px-4 py-3 text-left">Tenure</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Disbursed Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{loan.loanId || 'N/A'}</td>
                  <td className="px-4 py-2">{formatCurrency(loan.amount)}</td>
                  <td className="px-4 py-2">{formatCurrency(loan.emiAmount)}</td>
                  <td className="px-4 py-2">{loan.tenureMonths} months</td>
                  <td className="px-4 py-2">
                    <span className={getStatusBadge(loan.status)}>{loan.status || 'pending'}</span>
                  </td>
                  <td className="px-4 py-2">{loan.disbursementDate || '-'}</td>
                  <td className="px-4 py-2 text-center">
                    {/* ✅ View Button – now navigates to loan details */}
                    <button
                      onClick={() => handleView(loan.id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      View
                    </button>
                    {/* ✅ Repay Full Button – only for active/disbursed loans */}
                    {(loan.status === 'active' || loan.status === 'disbursed') && (
                      <button
                        onClick={() => handleRepayFull(loan.id)}
                        disabled={processing === loan.id || loan.outstandingPrincipal <= 0}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {processing === loan.id ? '...' : 'Repay Full'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerMyLoans;