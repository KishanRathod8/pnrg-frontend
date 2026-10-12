import { useState, useEffect } from 'react';
import api from '../services/api';
import VoucherList from '../components/Voucher/VoucherList';
import VoucherForm from '../components/Voucher/VoucherForm';
import toast from 'react-hot-toast';

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ keyword: '', voucherType: '', startDate: '', endDate: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchVouchers = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const res = await api.get('/vouchers', { params });
      setVouchers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load vouchers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchVouchers(newPage, filters);
  };

  const handleAdd = () => {
    setEditingVoucher(null);
    setShowForm(true);
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setShowForm(true);
  };

  const handleView = (voucher) => {
    setSelectedVoucher(voucher);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await api.delete(`/vouchers/${id}`);
        toast.success('Voucher deleted successfully');
        fetchVouchers(page, filters);
      } catch (err) {
        toast.error('Failed to delete voucher');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVoucher(null);
  };

  const handleFormSave = () => {
    fetchVouchers(page, filters);
    setShowForm(false);
    setEditingVoucher(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Vouchers</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + New Voucher
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="keyword"
          placeholder="Search by Voucher No, Branch..."
          value={filters.keyword}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
        <select
          name="voucherType"
          value={filters.voucherType}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        >
          <option value="">All Types</option>
          <option value="PAYMENT">Payment</option>
          <option value="RECEIPT">Receipt</option>
          <option value="CONTRA">Contra</option>
          <option value="JOURNAL">Journal</option>
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

      <VoucherList
        vouchers={vouchers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      {showForm && (
        <VoucherForm
          voucher={editingVoucher}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}

      {showViewModal && selectedVoucher && (
        <VoucherViewModal
          voucher={selectedVoucher}
          onClose={() => {
            setShowViewModal(false);
            setSelectedVoucher(null);
          }}
        />
      )}
    </div>
  );
};

export default Voucher;