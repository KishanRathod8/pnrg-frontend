const VoucherViewModal = ({ voucher, onClose }) => {
  const getTypeColor = (type) => {
    const colors = {
      PAYMENT: 'text-red-600 bg-red-50',
      RECEIPT: 'text-green-600 bg-green-50',
      CONTRA: 'text-blue-600 bg-blue-50',
      JOURNAL: 'text-purple-600 bg-purple-50',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-navy">Voucher Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg mb-4">
          <div><span className="text-gray-500">Voucher No:</span> <strong>{voucher.voucherNo}</strong></div>
          <div><span className="text-gray-500">Type:</span> <strong className={getTypeColor(voucher.voucherType)}>{voucher.voucherType}</strong></div>
          <div><span className="text-gray-500">Date:</span> <strong>{voucher.voucherDate}</strong></div>
          <div><span className="text-gray-500">Branch:</span> <strong>{voucher.branch || '-'}</strong></div>
          <div className="col-span-2"><span className="text-gray-500">Narration:</span> <strong>{voucher.narration || '-'}</strong></div>
          <div className="col-span-2"><span className="text-gray-500">Created By:</span> <strong>{voucher.createdBy || '-'}</strong></div>
        </div>

        <h3 className="text-sm font-semibold text-brand-navy mb-2">Ledger Entries</h3>
        <table className="w-full text-sm border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Ledger Name</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {voucher.entries.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{entry.ledgerName}</td>
                <td className="px-4 py-2 text-right">₹{entry.amount?.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.entryType === 'DEBIT' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {entry.entryType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

export default VoucherViewModal;