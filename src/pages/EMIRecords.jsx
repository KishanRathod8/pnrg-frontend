import { useState, useEffect } from 'react';
import api from '../services/api';
import EMIRecordsList from '../components/EMIRecords/EMIRecordsList';
import EMIScheduleModal from '../components/EMIRecords/EMIScheduleModal';
import toast from 'react-hot-toast';

const EMIRecords = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const fetchLoans = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
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
    fetchLoans(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchLoans(newPage, filters);
  };

  const handleViewSchedule = (loanId) => {
    setSelectedLoanId(loanId);
    setShowSchedule(true);
  };

  const handleCloseModal = () => {
    setShowSchedule(false);
    setSelectedLoanId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">EMI Records</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by Loan ID, Member..."
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
          <option value="active">Active</option>
          <option value="disbursed">Disbursed</option>
          <option value="completed">Completed</option>
          <option value="settled">Settled</option>
        </select>
      </div>

      <EMIRecordsList
        loans={loans}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onViewSchedule={handleViewSchedule}
      />

      {showSchedule && selectedLoanId && (
        <EMIScheduleModal
          loanId={selectedLoanId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EMIRecords;