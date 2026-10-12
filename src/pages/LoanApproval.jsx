import { useState, useEffect } from 'react';
import api from '../services/api';
import LoanApprovalList from '../components/LoanApproval/LoanApprovalList';
import toast from 'react-hot-toast';

const LoanApproval = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const fetchPendingLoans = async (pageNum = 0, keyword = '') => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        size: 10,
        status: 'pending', // only pending loans
        ...(keyword && { keyword })
      };
      const res = await api.get('/loans', { params });
      setLoans(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load pending loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans(0, search);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    fetchPendingLoans(newPage, search);
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this loan?')) {
      try {
        await api.patch(`/loans/${id}/status?status=approved&remarks=Approved by Admin`);
        toast.success('Loan approved successfully');
        fetchPendingLoans(page, search);
      } catch (err) {
        toast.error('Failed to approve loan');
        console.error(err);
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (reason === null) return; // user cancelled
    try {
      await api.patch(`/loans/${id}/status?status=rejected&remarks=${encodeURIComponent(reason)}`);
      toast.success('Loan rejected');
      fetchPendingLoans(page, search);
    } catch (err) {
      toast.error('Failed to reject loan');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Loan Approval</h1>
        <div className="text-sm text-gray-500">
          {!loading && loans.length === 0 ? 'No pending loans' : `${loans.length} pending loan(s)`}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <input
          type="text"
          placeholder="Search by Loan ID, Member, or Branch..."
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
      </div>

      <LoanApprovalList
        loans={loans}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default LoanApproval;