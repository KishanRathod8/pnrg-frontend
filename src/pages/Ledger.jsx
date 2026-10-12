import { useState, useEffect } from 'react';
import api from '../services/api';
import LedgerSummary from '../components/Ledger/LedgerSummary';
import LedgerList from '../components/Ledger/LedgerList';
import toast from 'react-hot-toast';

const Ledger = () => {
  const [ledgerNames, setLedgerNames] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchLedgerNames = async () => {
    try {
      const res = await api.get('/ledger/names');
      setLedgerNames(res.data);
      if (res.data.length > 0) {
        setSelectedLedger(res.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load ledger names');
      console.error(err);
    }
  };

  const fetchLedgerEntries = async () => {
    if (!selectedLedger || !filters.startDate || !filters.endDate) {
      toast.error('Please select ledger and date range');
      return;
    }
    setLoading(true);
    try {
      const params = {
        ledgerName: selectedLedger,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };
      const res = await api.get('/ledger', { params });
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load ledger entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerNames();
    // Set default dates (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    setFilters({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  }, []);

  useEffect(() => {
    if (selectedLedger && filters.startDate && filters.endDate) {
      fetchLedgerEntries();
    }
  }, [selectedLedger, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLedgerChange = (e) => {
    setSelectedLedger(e.target.value);
  };

  const handleSearch = () => {
    fetchLedgerEntries();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">General Ledger</h1>
        <button
          onClick={handleSearch}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ledger *</label>
          <select
            value={selectedLedger}
            onChange={handleLedgerChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
          >
            {ledgerNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
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
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-brand text-white px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : data && (
        <>
          <LedgerSummary data={data} />
          <LedgerList entries={data.entries} />
        </>
      )}
    </div>
  );
};

export default Ledger;