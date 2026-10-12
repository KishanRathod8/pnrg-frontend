import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const LoanSummary = () => {
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const fetchSummary = async () => {
    try {
      const res = await api.get('/loans/summary');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load summary stats:', err);
    }
  };

  const fetchLoans = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      // Remove empty values
      const cleanParams = {};
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] !== '' && filterParams[key] !== null && filterParams[key] !== undefined) {
          cleanParams[key] = filterParams[key];
        }
      });
      const params = { page: pageNum, size: 10, ...cleanParams };
      console.log('🔍 Fetching loans with params:', params); // Debug log
      const res = await api.get('/loans', { params });
      setLoans(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchLoans(0, filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log('🔍 Search clicked with filters:', filters);
    fetchLoans(0, filters);
  };

  const handlePageChange = (newPage) => {
    fetchLoans(newPage, filters);
  };

  const handleClearFilters = () => {
    setFilters({ keyword: '', status: '', startDate: '', endDate: '' });
    fetchLoans(0, { keyword: '', status: '', startDate: '', endDate: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
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

  if (loading && loans.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Loan Summary</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
            <p className="text-xs text-gray-500 uppercase">Total Loans</p>
            <p className="text-xl font-bold text-brand-navy">{stats.totalLoans}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
            <p className="text-xs text-gray-500 uppercase">Disbursed</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalDisbursed)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500 uppercase">Outstanding</p>
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.totalOutstanding)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
            <p className="text-xs text-gray-500 uppercase">Total Interest</p>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalInterest)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-indigo-500">
            <p className="text-xs text-gray-500 uppercase">Active Loans</p>
            <p className="text-xl font-bold text-indigo-600">{stats.activeLoans}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-gray-500">
            <p className="text-xs text-gray-500 uppercase">Completed</p>
            <p className="text-xl font-bold text-gray-600">{stats.completedLoans}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
            <p className="text-xs text-gray-500 uppercase">Pending</p>
            <p className="text-xl font-bold text-orange-600">{stats.pendingLoans}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="keyword"
            placeholder="Search by Loan ID, Member, Branch..."
            value={filters.keyword}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="disbursed">Disbursed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="settled">Settled</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
          <div className="flex gap-2">
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-brand text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Loan List */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📄</div>
            <p>No loan applications found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Loan ID</th>
                <th className="px-4 py-3 text-left">Member</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">EMI</th>
                <th className="px-4 py-3 text-left">Tenure</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Disbursed Date</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{loan.loanId}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{loan.memberName || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{loan.memberCode || loan.memberId}</div>
                  </td>
                  <td className="px-4 py-2">{loan.productName || 'N/A'}</td>
                  <td className="px-4 py-2">₹{loan.amount?.toLocaleString()}</td>
                  <td className="px-4 py-2">₹{loan.emiAmount?.toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.tenureMonths} months</td>
                  <td className="px-4 py-2">{loan.applicationDate}</td>
                  <td className="px-4 py-2">
                    <span className={getStatusBadge(loan.status)}>{loan.status}</span>
                  </td>
                  <td className="px-4 py-2">{loan.disbursementDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanSummary;