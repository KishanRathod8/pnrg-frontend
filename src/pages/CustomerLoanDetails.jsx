import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerLoanDetails = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const fetchLoanDetails = async () => {
    setLoading(true);
    try {
      // Fetch loan details
      const loanRes = await api.get(`/loans/${loanId}`);
      setLoan(loanRes.data);

      // Fetch EMI schedule
      const emiRes = await api.get(`/loans/${loanId}/emi-schedule`);
      setEmiSchedule(emiRes.data || []);
    } catch (err) {
      console.error('Failed to fetch loan details:', err);
      toast.error('Could not load loan details');
    } finally {
      setLoading(false);
    }
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
        <div className="text-center text-gray-500">Loading loan details...</div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="text-center py-12 text-red-500">
        Loan not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate('/customer/my-loans')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-brand-navy">Loan Details</h1>
      </div>

      {/* Loan Summary Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Loan ID</p>
            <p className="text-lg font-semibold text-brand-navy">{loan.loanId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={getStatusBadge(loan.status)}>{loan.status}</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">EMI</p>
            <p className="text-lg font-semibold">{formatCurrency(loan.emiAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tenure</p>
            <p className="text-lg font-semibold">{loan.tenureMonths} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-lg font-semibold">{loan.interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application Date</p>
            <p className="text-lg font-semibold">{formatDate(loan.applicationDate)}</p>
          </div>
          {loan.disbursementDate && (
            <div>
              <p className="text-sm text-gray-500">Disbursed Date</p>
              <p className="text-lg font-semibold">{formatDate(loan.disbursementDate)}</p>
            </div>
          )}
          {loan.outstandingPrincipal !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Outstanding Principal</p>
              <p className="text-lg font-semibold">{formatCurrency(loan.outstandingPrincipal)}</p>
            </div>
          )}
          {loan.totalPaid !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-lg font-semibold">{formatCurrency(loan.totalPaid)}</p>
            </div>
          )}
          {loan.branch && (
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="text-lg font-semibold">{loan.branch}</p>
            </div>
          )}
          {loan.remarks && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="text-lg font-semibold">{loan.remarks}</p>
            </div>
          )}
        </div>
      </div>

      {/* EMI Schedule */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-brand-navy mb-4">EMI Schedule</h2>
        {emiSchedule.length === 0 ? (
          <p className="text-gray-500">No EMI schedule available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {emiSchedule.map((emi, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{formatDate(emi.dueDate)}</td>
                    <td className="px-4 py-2">{formatCurrency(emi.amount)}</td>
                    <td className="px-4 py-2">
                      <span className={getStatusBadge(emi.status)}>
                        {emi.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLoanDetails;