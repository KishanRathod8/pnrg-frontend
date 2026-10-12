const LedgerSummary = ({ data }) => {
  const { ledgerName, totalDebit, totalCredit, closingBalance, startDate, endDate } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex flex-wrap justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-brand-navy">Ledger: {ledgerName}</h3>
        <span className="text-sm text-gray-500">Period: {startDate} to {endDate}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Debit</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(totalDebit)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">Total Credit</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
        </div>
        <div className={`bg-gray-50 p-3 rounded-lg text-center border-2 ${closingBalance >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <p className="text-sm text-gray-500">Closing Balance</p>
          <p className={`text-xl font-bold ${closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(closingBalance)}
            {closingBalance >= 0 ? ' (Dr)' : ' (Cr)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LedgerSummary;