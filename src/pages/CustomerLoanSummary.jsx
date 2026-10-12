import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerLoanSummary = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    outstanding: 0,
  });

  useEffect(() => {
    fetchLoanSummary();
  }, []);

  const fetchLoanSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/loans');
      const loanData = res.data || [];
      setLoans(loanData);
      computeStats(loanData);
    } catch (err) {
      console.error('Failed to fetch loan summary:', err);
      toast.error('Could not load your loan summary');
      setLoans([]);
      setStats({ totalApplications: 0, activeLoans: 0, totalDisbursed: 0, outstanding: 0 });
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (loanList) => {
    const total = loanList.length;
    const active = loanList.filter(l => l.status === 'active' || l.status === 'disbursed').length;
    const disbursed = loanList.reduce((sum, l) => sum + (l.amount || 0), 0);
    const outstanding = loanList.reduce((sum, l) => sum + (l.outstandingPrincipal || 0), 0);
    setStats({ totalApplications: total, activeLoans: active, totalDisbursed: disbursed, outstanding });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading your loan summary...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Loan Summary</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Total Applications</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.totalApplications}</p>
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
          <p className="text-2xl font-bold text-brand-navy">{formatCurrency(stats.outstanding)}</p>
        </div>
      </div>

      {/* Loan List Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>You haven't applied for any loans yet.</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerLoanSummary;