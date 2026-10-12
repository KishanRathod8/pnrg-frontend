import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerPayEMI = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/active-loans');
      // Filter out loans with zero outstanding (already fully paid)
      const activeLoans = (res.data || []).filter(
        loan => (loan.outstandingPrincipal || 0) > 0
      );
      setLoans(activeLoans);
    } catch (err) {
      console.error('Failed to fetch active loans:', err);
      toast.error('Could not load your active loans');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanSelect = (loanId) => {
    const loan = loans.find(l => l.id === Number(loanId));
    setSelectedLoan(loan);
    // Pre-fill with the smaller of EMI or outstanding
    if (loan) {
      const suggestedAmount = Math.min(loan.emiAmount || 0, loan.outstandingPrincipal || 0);
      setPaymentAmount(suggestedAmount > 0 ? suggestedAmount.toString() : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan) {
      toast.error('Please select a loan');
      return;
    }
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > selectedLoan.outstandingPrincipal) {
      toast.error(`Amount cannot exceed outstanding balance of ₹${selectedLoan.outstandingPrincipal.toLocaleString()}`);
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        loanId: selectedLoan.id,
        amount: amount,
        paymentMode: paymentMode,
        paymentDate: new Date().toISOString().split('T')[0],
      };
      await api.post('/customer/pay-emi', payload);
      toast.success('EMI payment successful!');
      // Refresh active loans
      fetchActiveLoans();
      setSelectedLoan(null);
      setPaymentAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
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
        <div className="text-center text-gray-500">Loading your active loans...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Pay EMI</h1>

      {loans.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>You have no active loans with outstanding balance.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Loan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Active Loan</label>
              <select
                value={selectedLoan?.id || ''}
                onChange={(e) => handleLoanSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                required
              >
                <option value="">Select a loan</option>
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.loanId} – {formatCurrency(loan.amount)} – Outstanding: {formatCurrency(loan.outstandingPrincipal)}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Details */}
            {selectedLoan && (
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Loan ID:</span> <strong>{selectedLoan.loanId}</strong></div>
                <div><span className="text-gray-500">Amount:</span> <strong>{formatCurrency(selectedLoan.amount)}</strong></div>
                <div><span className="text-gray-500">EMI:</span> <strong>{formatCurrency(selectedLoan.emiAmount)}</strong></div>
                <div><span className="text-gray-500">Outstanding:</span> <strong className="text-brand-pink">{formatCurrency(selectedLoan.outstandingPrincipal)}</strong></div>
                <div className="col-span-2">
                  <span className="text-gray-500">Tenure:</span> <strong>{selectedLoan.tenureMonths} months</strong>
                </div>
              </div>
            )}

            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Amount (₹)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                min="0"
                step="0.01"
                max={selectedLoan?.outstandingPrincipal || 0}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                required
              />
              {selectedLoan && (
                <p className="text-xs text-gray-400 mt-1">
                  Max: {formatCurrency(selectedLoan.outstandingPrincipal)}
                </p>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing || !selectedLoan}
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Pay EMI'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerPayEMI;