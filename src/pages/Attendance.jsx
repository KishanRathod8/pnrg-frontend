import { useState, useEffect } from 'react';
import api from '../services/api';
import AttendanceList from '../components/Attendance/AttendanceList';
import AttendanceForm from '../components/Attendance/AttendanceForm';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    branch: '',
    status: '',
    keyword: '',
    startDate: '',
    endDate: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const fetchRecords = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      // ✅ Use singular /attendance to match backend
      const res = await api.get('/attendance', { params });
      setRecords(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error(err.response?.data?.message || 'Failed to load attendance records');
      setRecords([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchRecords(newPage, filters);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await api.delete(`/attendance/${id}`);
        toast.success('Record deleted successfully');
        fetchRecords(page, filters);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleFormSave = () => {
    fetchRecords(page, filters);
    setShowForm(false);
    setEditingRecord(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Attendance Management</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Mark Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by employee name/ID..."
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
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
          <option value="holiday">Holiday</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
      </div>

      {/* Debug: Show total count */}
      {!loading && (
        <div className="text-sm text-gray-500 mb-2">
          {records.length === 0 ? '📭 No attendance records found' : `📊 Showing ${records.length} records`}
        </div>
      )}

      <AttendanceList
        records={records}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <AttendanceForm
          record={editingRecord}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default Attendance;