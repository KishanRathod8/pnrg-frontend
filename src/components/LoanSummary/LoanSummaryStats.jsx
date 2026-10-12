const LoanSummaryStats = ({ stats }) => {
  const {
    totalLoans,
    totalDisbursed,
    totalOutstanding,
    totalInterest,
    activeLoans,
    completedLoans,
    pendingLoans,
  } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
        <p className="text-xs text-gray-500 uppercase">Total Loans</p>
        <p className="text-xl font-bold text-brand-navy">{totalLoans}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
        <p className="text-xs text-gray-500 uppercase">Disbursed</p>
        <p className="text-xl font-bold text-green-600">₹{totalDisbursed?.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
        <p className="text-xs text-gray-500 uppercase">Outstanding</p>
        <p className="text-xl font-bold text-yellow-600">₹{totalOutstanding?.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
        <p className="text-xs text-gray-500 uppercase">Total Interest</p>
        <p className="text-xl font-bold text-purple-600">₹{totalInterest?.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-indigo-500">
        <p className="text-xs text-gray-500 uppercase">Active Loans</p>
        <p className="text-xl font-bold text-indigo-600">{activeLoans}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-gray-500">
        <p className="text-xs text-gray-500 uppercase">Completed</p>
        <p className="text-xl font-bold text-gray-600">{completedLoans}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
        <p className="text-xs text-gray-500 uppercase">Pending</p>
        <p className="text-xl font-bold text-orange-600">{pendingLoans}</p>
      </div>
    </div>
  );
};

export default LoanSummaryStats;