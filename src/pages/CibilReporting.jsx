import { useState, useEffect } from 'react';
import api from '../services/api';
import CibilScoreList from '../components/Cibil/CibilScoreList';
import CibilScoreForm from '../components/Cibil/CibilScoreForm';
import toast from 'react-hot-toast';

const CibilReporting = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ memberId: '', status: '', startDate: '', endDate: '' });
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchScores = async (pageNum = 0, filterParams = {}) => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10, ...filterParams };
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      const res = await api.get('/cibil/scores', { params });
      setScores(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load CIBIL scores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores(0, filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    fetchScores(newPage, filters);
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setShowForm(true);
  };

  const handleEdit = (score) => {
    setSelectedMember(score);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedMember(null);
  };

  const handleFormSave = () => {
    fetchScores(page, filters);
    setShowForm(false);
    setSelectedMember(null);
  };

  // Download handlers
  const downloadFile = (endpoint, filename) => {
    api.get(endpoint, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success(`Downloading ${filename}`);
      })
      .catch(() => toast.error('Failed to download file'));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">CIBIL Reporting</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add/Update Score
        </button>
      </div>

      {/* Download buttons */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={() => downloadFile('/cibil/download/consumer-loan', 'consumer_loan_report.pdf')}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          📄 Consumer Loan (PDF)
        </button>
        <button
          onClick={() => downloadFile('/cibil/download/mil-loan', 'mil_loan_report.pdf')}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
        >
          📄 MIL Loan (PDF)
        </button>
        <button
          onClick={() => downloadFile('/cibil/download/consumer-excel', 'consumer_loan.xlsx')}
          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm"
        >
          📊 Consumer Loan (Excel)
        </button>
        <button
          onClick={() => downloadFile('/cibil/download/mil-excel', 'mil_loan.xlsx')}
          className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition text-sm"
        >
          📊 MIL Loan (Excel)
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="memberId"
          placeholder="Member ID or Code..."
          value={filters.memberId}
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
          <option value="expired">Expired</option>
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

      <CibilScoreList
        scores={scores}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

      {showForm && (
        <CibilScoreForm
          score={selectedMember}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default CibilReporting;