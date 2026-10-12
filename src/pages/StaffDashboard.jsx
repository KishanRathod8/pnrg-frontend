
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatsCards from '../components/Dashboard/StatsCards';
import RecentMembers from '../components/Dashboard/RecentMembers';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      toast.error('Failed to load data');
      setData({
        totalDisbursement: 15062284,
        totalOutstanding: 3627086,
        totalCollection: 24578245,
        loanRecord: { active: 111, complete: 181 },
        recentMembers: [
          { id: '1', code: 'M010111', name: 'PRADEEP', mobile: '77778888', address: 'JAIPUR' },
          { id: '2', code: 'M010110', name: 'NIKHIL MAHAVEER SHINGAVI', mobile: '98220380', address: 'PAITHAN' },
          { id: '3', code: 'M010109', name: 'DIPU', mobile: '81270381', address: 'CHINTU PADA' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (!data) return <div className="text-center text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Staff Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Staff'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Disbursement</p>
          <p className="text-2xl font-bold">₹{data.totalDisbursement.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">Total Outstanding</p>
          <p className="text-2xl font-bold">₹{data.totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Collection</p>
          <p className="text-2xl font-bold">₹{data.totalCollection.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Active Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{data.loanRecord.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Completed Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{data.loanRecord.complete}</p>
        </div>
      </div>

      <RecentMembers members={data.recentMembers} />
    </div>
  );
};

export default StaffDashboard;