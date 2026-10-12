import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CibilScoreForm = ({ score, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    score: '',
    reportDate: '',
    status: 'active',
    remarks: '',
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/members', { params: { size: 100 } });
        setMembers(res.data.content || []);
      } catch (err) {
        console.error('Failed to load members:', err);
      }
    };
    fetchMembers();

    if (score) {
      setFormData({
        memberId: score.memberId || '',
        score: score.score || '',
        reportDate: score.reportDate || '',
        status: score.status || 'active',
        remarks: score.remarks || '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        reportDate: new Date().toISOString().split('T')[0],
      }));
    }
  }, [score]);

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
        score: parseInt(formData.score),
        createdBy: JSON.parse(localStorage.getItem('user') || '{}').code || 'ADMIN',
      };
      await api.post('/cibil/scores', payload);
      toast.success('CIBIL score saved successfully');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-4">
          {score ? 'Edit CIBIL Score' : 'Add/Update CIBIL Score'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Member *</label>
              <select
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Score *</label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleChange}
                required
                min="0"
                max="900"
                placeholder="CIBIL score (0-900)"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Date</label>
              <input
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
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
              {loading ? 'Saving...' : 'Save Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CibilScoreForm;