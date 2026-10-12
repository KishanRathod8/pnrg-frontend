const DisbursementList = ({ loans, loading, page, totalPages, onPageChange, onDisburse }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>No approved loans pending disbursement.</p>
          <p className="text-sm">All approved loans have been disbursed.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">EMI</th>
              <th className="px-4 py-3 text-left">Tenure</th>
              <th className="px-4 py-3 text-left">Application Date</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{loan.loanId}</td>
                <td className="px-4 py-2">
                  <div className="font-medium">{loan.memberName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{loan.memberCode || loan.memberId}</div>
                </td>
                <td className="px-4 py-2">{loan.productName || 'N/A'}</td>
                <td className="px-4 py-2">₹{loan.amount.toLocaleString()}</td>
                <td className="px-4 py-2">₹{loan.emiAmount?.toLocaleString()}</td>
                <td className="px-4 py-2">{loan.tenureMonths} months</td>
                <td className="px-4 py-2">{loan.applicationDate}</td>
                <td className="px-4 py-2">{loan.branch || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onDisburse(loan.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow"
                  >
                    💰 Disburse
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisbursementList;