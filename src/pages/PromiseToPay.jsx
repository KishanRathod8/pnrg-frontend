import { useState, useEffect } from 'react';
import api from '../services/api';
import PromiseList from '../components/Promise/PromiseList';
import PromiseForm from '../components/Promise/PromiseForm';
import toast from 'react-hot-toast';

const PromiseToPay = () => {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ keyword: '', status: '', startDate: '', endDate: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingPromise, setEditingPromise] = useState(null);

  const fetchPromises = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const res = await api.get('/promises', { params });
      setPromises(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load promises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromises(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchPromises(newPage, filters);
  };

  const handleAdd = () => {
    setEditingPromise(null);
    setShowForm(true);
  };

  const handleEdit = (promise) => {
    setEditingPromise(promise);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promise?')) {
      try {
        await api.delete(`/promises/${id}`);
        toast.success('Promise deleted successfully');
        fetchPromises(page, filters);
      } catch (err) {
        toast.error('Failed to delete promise');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/promises/${id}/status?status=${status}`);
      toast.success(`Promise ${status} successfully`);
      fetchPromises(page, filters);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPromise(null);
  };

  const handleFormSave = () => {
    fetchPromises(page, filters);
    setShowForm(false);
    setEditingPromise(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Promise to Pay</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + New Promise
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by branch or note..."
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
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
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

      <PromiseList
        promises={promises}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusUpdate={handleStatusUpdate}
      />

      {showForm && (
        <PromiseForm
          promise={editingPromise}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default PromiseToPay;