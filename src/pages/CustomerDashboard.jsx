import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeLoans: 0,
    totalDisbursed: 0,
    runningLoans: 0,
    outstanding: 0,
    totalPayable: 0,
    kycStatus: 'PENDING',
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      // Fallback data
      setStats({
        totalApplications: 0,
        activeLoans: 0,
        totalDisbursed: 0,
        runningLoans: 0,
        outstanding: 0,
        totalPayable: 0,
        kycStatus: 'PENDING',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const getKycStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getKycStatusText = (status) => {
    const texts = {
      PENDING: 'Action Required',
      SUBMITTED: 'Under Review',
      VERIFIED: 'Approved ✅',
      REJECTED: 'Rejected ❌',
    };
    return texts[status] || 'Pending';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Customer Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, <strong>{user?.name || 'Customer'}</strong> · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KYC Banner */}
      {stats.kycStatus !== 'VERIFIED' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-yellow-700 font-medium">KYC Verification Required</p>
              <p className="text-yellow-600 text-sm">Complete your KYC to unlock loan applications and full portal access.</p>
            </div>
            <button
              onClick={() => handleNavigate('/customer/kyc')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Complete KYC
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => handleNavigate('/customer/kyc')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xs font-medium text-gray-700">Complete KYC</div>
            <div className="text-xs text-gray-400">Verify documents</div>
          </button>
          <button
            onClick={() => handleNavigate('/loan/apply')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">💰</div>
            <div className="text-xs font-medium text-gray-700">Apply for Loan</div>
            <div className="text-xs text-gray-400">Submit application</div>
          </button>
          <button
            onClick={() => handleNavigate('/customer/my-loans')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs font-medium text-gray-700">My Loans</div>
            <div className="text-xs text-gray-400">View all loans</div>
          </button>
          <button
            onClick={() => handleNavigate('/customer/pay-emi')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">💳</div>
            <div className="text-xs font-medium text-gray-700">Pay EMI Online</div>
            <div className="text-xs text-gray-400">Make repayments</div>
          </button>
          <button
            onClick={() => handleNavigate('/customer/repay-full')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">💸</div>
            <div className="text-xs font-medium text-gray-700">Repay Full Loan</div>
            <div className="text-xs text-gray-400">Clear entire loan</div>
          </button>
          <button
            onClick={() => handleNavigate('/customer/payment-history')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">📜</div>
            <div className="text-xs font-medium text-gray-700">Payment History</div>
            <div className="text-xs text-gray-400">View transactions</div>
          </button>
          <button
            onClick={() => handleNavigate('/customer/profile')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100"
          >
            <div className="text-2xl mb-1">👤</div>
            <div className="text-xs font-medium text-gray-700">My Profile</div>
            <div className="text-xs text-gray-400">Update information</div>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase">Total Applications</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.totalApplications}</p>
          <p className="text-xs text-gray-400">All time submissions</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase">Active Loans</p>
          <p className="text-2xl font-bold text-brand-navy">{stats.activeLoans}</p>
          <p className="text-xs text-gray-400">Currently running</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase">Total Disbursed</p>
          <p className="text-2xl font-bold text-brand-navy">₹{stats.totalDisbursed?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-400">Amount received</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 uppercase">Outstanding</p>
          <p className="text-2xl font-bold text-brand-navy">₹{stats.outstanding?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-400">Amount payable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KYC Status Card */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">KYC Status</h3>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getKycStatusBadge(stats.kycStatus)}`}>
              {stats.kycStatus}
            </div>
            <span className="text-sm text-gray-500">{getKycStatusText(stats.kycStatus)}</span>
          </div>
          {stats.kycStatus !== 'VERIFIED' && (
            <button
              onClick={() => handleNavigate('/customer/kyc')}
              className="mt-3 text-sm text-brand-pink hover:underline"
            >
              {stats.kycStatus === 'PENDING' ? 'Complete KYC →' : 'Check Status →'}
            </button>
          )}
          {stats.kycStatus === 'VERIFIED' && (
            <div className="mt-3 text-sm text-green-600">✅ KYC Verified</div>
          )}
        </div>

        {/* Upcoming EMIs Card */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Upcoming EMIs</h3>
          {stats.activeLoans > 0 ? (
            <>
              <p className="text-sm text-gray-500">You have upcoming EMI payments.</p>
              <button
                onClick={() => handleNavigate('/customer/pay-emi')}
                className="mt-2 bg-brand-pink text-white px-4 py-1.5 rounded-lg text-sm hover:bg-opacity-80 transition"
              >
                Pay Now →
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">No upcoming EMIs due.</p>
          )}
        </div>

        {/* Active Loans Card */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Active Loans</h3>
          {stats.activeLoans > 0 ? (
            <p className="text-sm text-gray-500">You have {stats.activeLoans} active loan(s).</p>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-sm text-gray-500">No active loans at the moment.</p>
              <button
                onClick={() => handleNavigate('/loan/apply')}
                className="mt-2 text-brand-pink text-sm hover:underline"
              >
                + Apply for your first loan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>Logged in</span>
            <span className="text-gray-400">Just now</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>KYC {stats.kycStatus === 'VERIFIED' ? 'Verified ✅' : 'Pending'}</span>
            <span className="text-gray-400">Action required</span>
          </div>
          <div className="flex justify-between">
            <span>Application(s)</span>
            <span className="text-gray-400">{stats.totalApplications} all time</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
        PNRG Finance Pvt. Ltd. — All rights reserved.
      </div>
    </div>
  );
};

export default CustomerDashboard;