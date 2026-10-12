import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerPaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalPayments: 0,
    lastPaymentDate: null,
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/payment-history');
      const data = res.data || [];
      setPayments(data);
      computeStats(data);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
      toast.error('Could not load payment history');
      setPayments([]);
      setStats({ totalPaid: 0, totalPayments: 0, lastPaymentDate: null });
    } finally {
      setLoading(false);
    }
  };

  const computeStats = (paymentsList) => {
    const total = paymentsList.length;
    const totalAmount = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
    const last = paymentsList.length > 0 ? paymentsList[0].paymentDate : null; // Assuming sorted by date desc
    setStats({
      totalPayments: total,
      totalPaid: totalAmount,
      lastPaymentDate: last,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Payment History</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Total Paid</p>
          <p className="text-2xl font-bold text-brand-navy">{formatCurrency(stats.totalPaid)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Total Payments</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.totalPayments}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase">Last Payment</p>
          <p className="text-2xl font-bold text-brand-navy">{formatDate(stats.lastPaymentDate)}</p>
        </div>
      </div>

      {/* Payment List Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>You have no payment history.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Loan ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Payment Date</th>
                <th className="px-4 py-3 text-left">Payment Mode</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{payment.id}</td>
                  <td className="px-4 py-2">{payment.loanIdDisplay || payment.loanId}</td>
                  <td className="px-4 py-2">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-2">{formatDate(payment.paymentDate)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      payment.paymentMode === 'cash' ? 'bg-green-100 text-green-800' :
                      payment.paymentMode === 'bank' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {payment.paymentMode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {payment.status || 'completed'}
                    </span>
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

export default CustomerPaymentHistory;