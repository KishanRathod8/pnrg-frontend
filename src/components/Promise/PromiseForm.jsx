import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PromiseForm = ({ promise, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    memberId: '',
    amount: '',
    promiseDate: '',
    promiseNote: '',
    branch: '',
    geoLocation: '',
  });
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get('/loans', { 
          params: { status: 'active,disbursed', size: 100 } 
        });
        setLoans(res.data.content || []);
      } catch (err) {
        console.error('Failed to load loans:', err);
        toast.error('Failed to load active loans');
      }
    };
    fetchLoans();

    if (promise) {
      setFormData({
        loanId: promise.loanId || '',
        memberId: promise.memberId || '',
        amount: promise.amount || '',
        promiseDate: promise.promiseDate || '',
        promiseNote: promise.promiseNote || '',
        branch: promise.branch || '',
        geoLocation: promise.geoLocation || '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        promiseDate: new Date().toISOString().split('T')[0],
      }));
    }
  }, [promise]);

  const handleLoanChange = async (e) => {
    const loanId = e.target.value;
    setFormData((prev) => ({ ...prev, loanId }));
    if (loanId) {
      try {
        const res = await api.get(`/loans/${loanId}`);
        setFormData((prev) => ({
          ...prev,
          memberId: res.data.memberId,
        }));
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
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        createdBy: JSON.parse(localStorage.getItem('user') || '{}').code || 'ADMIN',
      };
      if (promise) {
        await api.put(`/promises/${promise.id}`, payload);
        toast.success('Promise updated successfully');
      } else {
        await api.post('/promises', payload);
        toast.success('Promise created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save promise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-4">
          {promise ? 'Edit Promise' : 'New Promise to Pay'}
        </h2>
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
                placeholder="Enter amount"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Promise Date *</label>
              <input
                type="date"
                name="promiseDate"
                value={formData.promiseDate}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Geo Location</label>
              <input
                type="text"
                name="geoLocation"
                value={formData.geoLocation}
                onChange={handleChange}
                placeholder="e.g., Lat/Lng or address"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Promise Note</label>
              <textarea
                name="promiseNote"
                value={formData.promiseNote}
                onChange={handleChange}
                rows="2"
                placeholder="Any additional details..."
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
              {loading ? 'Saving...' : promise ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromiseForm;