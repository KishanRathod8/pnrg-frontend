import { useState, useEffect } from 'react';
import api from '../services/api';
import DisbursementList from '../components/Disbursement/DisbursementList';
import toast from 'react-hot-toast';

const Disbursement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const fetchApprovedLoans = async (pageNum = 0, keyword = '') => {
    setLoading(true);
    try {
      const params = { 
        page: pageNum, 
        size: 10, 
        status: 'approved',  // only approved loans
        ...(keyword && { keyword })
      };
      const res = await api.get('/loans', { params });
      setLoans(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load approved loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedLoans(0, search);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    fetchApprovedLoans(newPage, search);
  };

  const handleDisburse = async (id) => {
    if (window.confirm('Are you sure you want to disburse this loan?')) {
      try {
        await api.patch(`/loans/${id}/status?status=disbursed&remarks=Disbursed on ${new Date().toLocaleDateString()}`);
        toast.success('Loan disbursed successfully');
        fetchApprovedLoans(page, search);
      } catch (err) {
        toast.error('Failed to disburse loan');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Loan Disbursement</h1>
        <div className="text-sm text-gray-500">
          {!loading && loans.length === 0 ? 'No approved loans pending disbursement' : `${loans.length} loan(s) ready for disbursement`}
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

      <DisbursementList
        loans={loans}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDisburse={handleDisburse}
      />
    </div>
  );
};

export default Disbursement;