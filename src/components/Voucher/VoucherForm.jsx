import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VoucherForm = ({ voucher, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    voucherType: 'PAYMENT',
    voucherDate: '',
    narration: '',
    branch: '',
    entries: [
      { ledgerName: '', amount: '', entryType: 'DEBIT' },
      { ledgerName: '', amount: '', entryType: 'CREDIT' },
    ],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (voucher) {
      setFormData({
        voucherType: voucher.voucherType || 'PAYMENT',
        voucherDate: voucher.voucherDate || '',
        narration: voucher.narration || '',
        branch: voucher.branch || '',
        entries: voucher.entries && voucher.entries.length > 0
          ? voucher.entries.map(e => ({
              id: e.id,
              ledgerName: e.ledgerName || '',
              amount: e.amount || '',
              entryType: e.entryType || 'DEBIT',
            }))
          : [
              { ledgerName: '', amount: '', entryType: 'DEBIT' },
              { ledgerName: '', amount: '', entryType: 'CREDIT' },
            ],
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        voucherDate: new Date().toISOString().split('T')[0],
      }));
    }
  }, [voucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index, field, value) => {
    const updated = [...formData.entries];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, entries: updated }));
  };

  const addEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [...prev.entries, { ledgerName: '', amount: '', entryType: 'DEBIT' }],
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length <= 2) {
      toast.error('Minimum 2 entries required');
      return;
    }
    const updated = formData.entries.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, entries: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate entries
      const invalid = formData.entries.some(e => !e.ledgerName || !e.amount);
      if (invalid) {
        toast.error('Please fill all entry fields');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        entries: formData.entries.map(e => ({
          ...e,
          amount: parseFloat(e.amount),
        })),
        createdBy: JSON.parse(localStorage.getItem('user') || '{}').code || 'ADMIN',
      };

      if (voucher) {
        await api.put(`/vouchers/${voucher.id}`, payload);
        toast.success('Voucher updated successfully');
      } else {
        await api.post('/vouchers', payload);
        toast.success('Voucher created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-4">
          {voucher ? 'Edit Voucher' : 'New Voucher'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Voucher Type *</label>
              <select
                name="voucherType"
                value={formData.voucherType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="PAYMENT">Payment</option>
                <option value="RECEIPT">Receipt</option>
                <option value="CONTRA">Contra</option>
                <option value="JOURNAL">Journal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                name="voucherDate"
                value={formData.voucherDate}
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
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Narration</label>
              <textarea
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-brand-navy mb-2">Ledger Entries</h3>
            <div className="space-y-2">
              {formData.entries.map((entry, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Ledger Name"
                    value={entry.ledgerName}
                    onChange={(e) => handleEntryChange(index, 'ledgerName', e.target.value)}
                    className="flex-1 min-w-[120px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                    className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent text-sm"
                  />
                  <select
                    value={entry.entryType}
                    onChange={(e) => handleEntryChange(index, 'entryType', e.target.value)}
                    className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent text-sm"
                  >
                    <option value="DEBIT">Debit</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEntry}
              className="mt-2 text-sm text-brand-pink hover:text-brand-pink/80 font-medium"
            >
              + Add Entry
            </button>
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
              {loading ? 'Saving...' : voucher ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherForm;