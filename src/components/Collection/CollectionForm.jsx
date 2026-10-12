import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CollectionForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    memberId: '',
    amount: '',
    paymentMode: 'cash',
    branch: '',
    remarks: '',
  });
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setFetching(true);
    try {
      // ✅ Fetch active AND disbursed loans
      const res = await api.get('/loans', {
        params: { status: 'active,disbursed', size: 100 }
      });
      console.log('📦 Loan response:', res.data);
      // The response should be a Page object with 'content'
      const loanData = res.data.content || [];
      setLoans(loanData);
      console.log('📦 Loans set:', loanData);
      if (loanData.length === 0) {
        toast.info('No active or disbursed loans found.');
      }
    } catch (err) {
      console.error('Failed to load loans:', err);
      toast.error('Failed to load active/disbursed loans');
    } finally {
      setFetching(false);
    }
  };

  const handleLoanChange = async (e) => {
    const loanId = e.target.value;
    setFormData((prev) => ({ ...prev, loanId }));
    if (loanId) {
      try {
        const res = await api.get(`/loans/${loanId}`);
        setSelectedLoan(res.data);
        setFormData((prev) => ({
          ...prev,
          memberId: res.data.memberId,
        }));
        // Fetch member details
        const memberRes = await api.get(`/members/${res.data.memberId}`);
        setMembers([memberRes.data]);
      } catch (err) {
        console.error('Failed to load loan details:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan) {
      toast.error('Please select a loan');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        loanId: parseInt(selectedLoan.id),
        memberId: parseInt(formData.memberId),
        amount: parseFloat(formData.amount),
        paymentMode: formData.paymentMode,
        receivedBy: JSON.parse(localStorage.getItem('user') || '{}').code || 'ADMIN',
        branch: formData.branch,
        remarks: formData.remarks,
      };
      await api.post('/collections', payload);
      toast.success('Payment collected successfully!');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to collect payment');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">Loading loans...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-4">Collect Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan *</label>
              <select
                name="loanId"
                value={formData.loanId}
                onChange={handleLoanChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="">Select Active Loan</option>
                {loans.length === 0 ? (
                  <option value="" disabled>No active/disbursed loans available</option>
                ) : (
                  loans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      {loan.loanId} - {loan.memberName || loan.memberId} - ₹{loan.amount?.toLocaleString()} ({loan.status})
                    </option>
                  ))
                )}
              </select>
              {loans.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No active or disbursed loans found. Please disburse a loan first.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member</label>
              <input
                type="text"
                value={members.length > 0 ? members[0]?.name || '' : ''}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            {selectedLoan && (
              <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div><span className="text-gray-500">Loan Amount:</span> <strong>₹{selectedLoan.amount?.toLocaleString()}</strong></div>
                <div><span className="text-gray-500">Outstanding:</span> <strong>₹{selectedLoan.outstandingPrincipal?.toLocaleString() || selectedLoan.amount?.toLocaleString()}</strong></div>
                <div><span className="text-gray-500">EMI:</span> <strong>₹{selectedLoan.emiAmount?.toLocaleString()}</strong></div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter payment amount"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Collect Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm;