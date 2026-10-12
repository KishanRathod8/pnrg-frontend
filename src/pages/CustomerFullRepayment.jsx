import { useState, useEffect } from 'react';
import { useNavigate }from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerFullRepayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/active-loans');
      setLoans(res.data || []);
    } catch (err) {
      console.error('Failed to fetch active loans:', err);
      toast.error('Could not load your active loans');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayFull = async (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const confirmMsg = `Are you sure you want to repay the full outstanding amount of ${formatCurrency(loan.outstandingPrincipal)} for loan ${loan.loanId}?`;
    if (!window.confirm(confirmMsg)) return;

    setProcessing(loanId);
    try {
      await api.post('/customer/repay-full', { loanId });
      toast.success('Loan fully repaid!');
      // Refresh the list
      fetchActiveLoans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to repay loan');
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading active loans...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Repay Full Loan</h1>
        <button
          onClick={() => navigate('/customer/pay-emi')}
          className="px-4 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition"
        >
          Pay EMI
        </button>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>You have no active loans.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-xl shadow p-6 flex flex-wrap items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Loan ID</p>
                <p className="font-semibold text-brand-navy">{loan.loanId}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">Amount:</span>{' '}
                    <span className="font-medium">{formatCurrency(loan.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">EMI:</span>{' '}
                    <span className="font-medium">{formatCurrency(loan.emiAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Outstanding:</span>{' '}
                    <span className="font-medium text-brand-pink">{formatCurrency(loan.outstandingPrincipal)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tenure:</span>{' '}
                    <span className="font-medium">{loan.tenureMonths} months</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col gap-2">
                <button
                  onClick={() => handleRepayFull(loan.id)}
                  disabled={processing === loan.id || loan.outstandingPrincipal <= 0}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {processing === loan.id ? 'Processing...' : 'Repay Full'}
                </button>
                <button
                  onClick={() => navigate('/customer/pay-emi')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Pay EMI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFullRepayment;