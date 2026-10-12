import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMIScheduleModal = ({ loanId, onClose }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loanInfo, setLoanInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, loanRes] = await Promise.all([
          api.get(`/loans/${loanId}/emi-schedule`),
          api.get(`/loans/${loanId}`)
        ]);
        setSchedule(scheduleRes.data);
        setLoanInfo(loanRes.data);
      } catch (err) {
        toast.error('Failed to load EMI schedule');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loanId]);

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8">
        <p>Loading EMI schedule...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-navy">
            EMI Schedule - {loanInfo?.loanId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loanInfo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div><span className="text-gray-500">Member:</span> <strong>{loanInfo.memberName}</strong></div>
            <div><span className="text-gray-500">Amount:</span> <strong>₹{loanInfo.amount?.toLocaleString()}</strong></div>
            <div><span className="text-gray-500">EMI:</span> <strong>₹{loanInfo.emiAmount?.toLocaleString()}</strong></div>
            <div><span className="text-gray-500">Tenure:</span> <strong>{loanInfo.tenureMonths} months</strong></div>
          </div>
        )}

        {schedule.length === 0 ? (
          <p className="text-center text-gray-500">No EMI schedule found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((emi, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{emi.dueDate}</td>
                  <td className="px-4 py-2">₹{emi.amount?.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={getStatusBadge(emi.status)}>{emi.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EMIScheduleModal;