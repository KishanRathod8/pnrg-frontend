import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatsCards from '../components/Dashboard/StatsCards';
import KPIGrid from '../components/Dashboard/KPIGrid';
import Widgets from '../components/Dashboard/Widgets';
import RecentMembers from '../components/Dashboard/RecentMembers';
import toast from 'react-hot-toast';

const Dashboard = () => {
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
      console.error('Failed to fetch dashboard stats:', err);
      toast.error('Failed to load dashboard data');
      // Fallback data (should match the backend response structure)
      setData({
        totalBalance: 18127259,
        bankBalance: 9384800,
        cashBalance: 8737959,
        smsBalance: 0,
        totalDisbursement: 15062284,
        totalOutstanding: 3627086,
        totalCollection: 24578245,
        totalInterest: 3142343,
        profitLoss: { income: 9397591, expense: 8064144, net: 1333447 },
        settlement: { due: 267297, paid: 243529 },
        loanRecord: { active: 111, complete: 181, settled: 21, principalOutstanding: 1703228 },
        recentMembers: [
          { id: '1', code: 'M010111', name: 'PRADEEP', mobile: '77778888', address: 'JAIPUR' },
          { id: '2', code: 'M010110', name: 'NIKHIL MAHAVEER SHINGAVI', mobile: '98220380', address: 'PAITHAN' },
          { id: '3', code: 'M010109', name: 'DIPU', mobile: '81270381', address: 'CHINTU PADA' },
          { id: '4', code: 'M010108', name: 'HARISH PAUL', mobile: '82406789', address: 'BA-294, BIDHANNAGAR, SALT LAKE SECTOR - 1' },
          { id: '5', code: 'M010107', name: 'DILEEP KUMAR', mobile: '87566178', address: 'AMA KUNWA KAUSHAMBI' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers for shortcut buttons
  const navigateTo = (path) => navigate(path);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">Failed to load dashboard data.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shortcuts */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigateTo('/members')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 MEMBERS
        </button>
        <button
          onClick={() => navigateTo('/loan/apply')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 PLAN
        </button>
        <button
          onClick={() => navigateTo('/loan/apply')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 LOAN
        </button>
        <button
          onClick={() => navigateTo('/groups')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 GROUP LOAN
        </button>
        <button
          onClick={() => navigateTo('/loan/summary')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 LOAN DETAILS
        </button>
        <button
          onClick={() => navigateTo('/collection/member')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 COLLECT EMI
        </button>
        <button
          onClick={() => navigateTo('/loan/summary')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 SETTLEMENT
        </button>
        <button
          onClick={() => navigateTo('/products')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 PRODUCT MASTER
        </button>
        <button
          onClick={() => navigateTo('/attendance')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 ATTENDANCE
        </button>
        <button
          onClick={() => navigateTo('/approvals/loan')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 LOAN APPROVALS
        </button>
        <button
          onClick={() => navigateTo('/accounting/voucher')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 VOUCHER
        </button>
        <button
          onClick={() => navigateTo('/settings/roles')}
          className="px-4 py-1 bg-white rounded-full text-sm shadow border hover:border-brand-pink transition cursor-pointer"
        >
          📌 ROLES
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards data={data} />

      {/* KPI Grid */}
      <KPIGrid data={data} />

      {/* Widgets (P&L, Settlement, Loan Record, Collection summary) */}
      <Widgets data={data} />

      {/* Recent Members Table */}
      <RecentMembers members={data.recentMembers} />

      {/* Footer info */}
      <div className="bg-white rounded-xl p-4 shadow flex flex-wrap justify-between text-sm text-gray-500">
        <span><strong>Session:</strong> 2026-2027</span>
        <span><strong>Branch:</strong> SHREEJA GROUP</span>
        <span><strong>Admin:</strong> ADM01</span>
        <span><strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}</span>
      </div>
    </div>
  );
};

export default Dashboard;