import { useState, useEffect } from 'react';
import api from '../services/api';
import LeaveList from '../components/EmployeeLeave/LeaveList';
import LeaveForm from '../components/EmployeeLeave/LeaveForm';
import toast from 'react-hot-toast';

const EmployeeLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    branch: '',
    leaveType: '',
    status: '',
    keyword: '',
    startDate: '',
    endDate: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);

  const fetchLeaves = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const res = await api.get('/leaves', { params });
      setLeaves(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load leaves');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchLeaves(newPage, filters);
  };

  const handleAdd = () => {
    setEditingLeave(null);
    setShowForm(true);
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      try {
        await api.delete(`/leaves/${id}`);
        toast.success('Leave deleted successfully');
        fetchLeaves(page, filters);
      } catch (err) {
        toast.error('Failed to delete leave');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}/status?status=${status}`);
      toast.success(`Leave ${status} successfully`);
      fetchLeaves(page, filters);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLeave(null);
  };

  const handleFormSave = () => {
    fetchLeaves(page, filters);
    setShowForm(false);
    setEditingLeave(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Employee Leave Management</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Apply Leave
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by employee name or ID..."
          value={filters.keyword}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
        <select
          name="leaveType"
          value={filters.leaveType}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        >
          <option value="">All Leave Types</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Personal Leave">Personal Leave</option>
        </select>
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
        </select>
      </div>

      <LeaveList
        leaves={leaves}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />

      {showForm && (
        <LeaveForm
          leave={editingLeave}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default EmployeeLeave;