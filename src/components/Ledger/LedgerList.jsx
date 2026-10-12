const LedgerList = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📘</div>
        <p>No transactions found for this ledger.</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Voucher No</th>
            <th className="px-4 py-3 text-left">Narration</th>
            <th className="px-4 py-3 text-right">Debit</th>
            <th className="px-4 py-3 text-right">Credit</th>
            <th className="px-4 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{entry.date}</td>
              <td className="px-4 py-2 font-medium">{entry.voucherNo}</td>
              <td className="px-4 py-2 truncate max-w-xs">{entry.narration || '-'}</td>
              <td className="px-4 py-2 text-right">
                {entry.entryType === 'DEBIT' ? formatCurrency(entry.amount) : '-'}
              </td>
              <td className="px-4 py-2 text-right">
                {entry.entryType === 'CREDIT' ? formatCurrency(entry.amount) : '-'}
              </td>
              <td className="px-4 py-2 text-right font-medium">
                {formatCurrency(entry.balance)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerList;