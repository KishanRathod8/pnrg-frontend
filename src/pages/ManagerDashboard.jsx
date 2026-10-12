import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/manager/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (!stats) return <div className="text-center py-8 text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Manager Dashboard</h1>
        <span className="text-sm text-gray-500">Branch: <strong>{stats.branchCode}</strong></span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Total Members</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Active Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.activeLoans}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase">Total Collections</p>
          <p className="text-2xl font-bold text-brand-navy">₹{stats.totalCollectionAmount?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 uppercase">Outstanding</p>
          <p className="text-2xl font-bold text-brand-navy">₹{stats.totalOutstanding?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Loan Summary</h3>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between"><span>Total Loans</span><span>{stats.totalLoans}</span></div>
            <div className="flex justify-between"><span>Active</span><span>{stats.activeLoans}</span></div>
            <div className="flex justify-between"><span>Completed</span><span>{stats.completedLoans}</span></div>
            <div className="flex justify-between"><span>Disbursed</span><span>₹{stats.totalDisbursed?.toLocaleString() || 0}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase">Member Summary</h3>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between"><span>Total Members</span><span>{stats.totalMembers}</span></div>
            <div className="flex justify-between"><span>Active Members</span><span>{stats.activeMembers}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;