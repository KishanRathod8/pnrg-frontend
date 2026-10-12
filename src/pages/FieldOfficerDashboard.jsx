import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const FieldOfficerDashboard = () => {
  const [stats, setStats] = useState({ pendingKYC: 0, pendingCollections: 0, totalMembers: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFieldOfficerStats();
  }, []);

  const fetchFieldOfficerStats = async () => {
    try {
      // Custom endpoint for field officer stats
      const res = await api.get('/field-officer/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // fallback
      setStats({ pendingKYC: 5, pendingCollections: 12, totalMembers: 45 });
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => navigate(path);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Field Officer Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Officer'}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending KYC</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingKYC}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Pending Collections</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pendingCollections}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Members Visited</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalMembers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigateTo('/field-officer/kyc')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-center border border-gray-100">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-sm font-medium">Verify KYC</div>
        </button>
        <button onClick={() => navigateTo('/field-officer/collections')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-center border border-gray-100">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-sm font-medium">Collect EMI</div>
        </button>
        <button onClick={() => navigateTo('/members')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-center border border-gray-100">
          <div className="text-2xl mb-1">👤</div>
          <div className="text-sm font-medium">View Members</div>
        </button>
        <button onClick={() => navigateTo('/field-officer/reports')} className="bg-white p-4 rounded-xl shadow hover:shadow-md text-center border border-gray-100">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm font-medium">Reports</div>
        </button>
      </div>

      {/* Recent Activity / List */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Recent Tasks</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>KYC Verification for John Doe</span>
            <span className="text-yellow-500">Pending</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>EMI Collection – Loan #LN-2026-001</span>
            <span className="text-green-500">Completed</span>
          </div>
          <div className="flex justify-between">
            <span>Member Visit – Rajesh Kumar</span>
            <span className="text-blue-500">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOfficerDashboard;