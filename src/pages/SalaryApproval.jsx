import { useState, useEffect } from 'react';
import api from '../services/api';
import SalaryApprovalList from '../components/SalaryApproval/SalaryApprovalList';
import SalaryRequestForm from '../components/SalaryApproval/SalaryRequestForm';
import toast from 'react-hot-toast';

const SalaryApproval = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ keyword: '', status: 'pending' });
  const [showForm, setShowForm] = useState(false);

  const fetchSalaries = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const res = await api.get('/salaries', { params });
      setSalaries(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load salary requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchSalaries(newPage, filters);
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this salary?')) {
      try {
        await api.patch(`/salaries/${id}/status?status=approved&remarks=Approved by Admin`);
        toast.success('Salary approved successfully');
        fetchSalaries(page, filters);
      } catch (err) {
        toast.error('Failed to approve salary');
        console.error(err);
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (reason === null) return; // user cancelled
    try {
      await api.patch(`/salaries/${id}/status?status=rejected&remarks=${encodeURIComponent(reason)}`);
      toast.success('Salary rejected');
      fetchSalaries(page, filters);
    } catch (err) {
      toast.error('Failed to reject salary');
      console.error(err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSave = () => {
    fetchSalaries(page, filters);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Salary Approval</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Request Salary
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by Employee, ID, Branch..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      <SalaryApprovalList
        salaries={salaries}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {showForm && (
        <SalaryRequestForm
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default SalaryApproval;