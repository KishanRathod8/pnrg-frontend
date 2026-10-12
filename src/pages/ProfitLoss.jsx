import { useState, useEffect } from 'react';
import api from '../services/api';
import ProfitLossSummary from '../components/ProfitLoss/ProfitLossSummary';
import ProfitLossCategoryList from '../components/ProfitLoss/ProfitLossCategoryList';
import toast from 'react-hot-toast';

const ProfitLoss = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    branch: '',
  });

  const fetchProfitLoss = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.branch) params.branch = filters.branch;

      const res = await api.get('/profit-loss', { params });
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load profit & loss data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default dates (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    setFilters({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      branch: '',
    });
  }, []);

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchProfitLoss();
    }
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchProfitLoss();
  };

  if (loading && !data) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Profit & Loss Statement</h1>
        <button
          onClick={handleSearch}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          📊 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date *</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            name="branch"
            placeholder="All Branches"
            value={filters.branch}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {data && <ProfitLossSummary data={data} />}

      {/* Detailed Breakdown */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfitLossCategoryList
            title="Income"
            categories={data.incomeCategories}
            total={data.totalIncome}
            type="income"
          />
          <ProfitLossCategoryList
            title="Expenses"
            categories={data.expenseCategories}
            total={data.totalExpense}
            type="expense"
          />
        </div>
      )}
    </div>
  );
};

export default ProfitLoss;