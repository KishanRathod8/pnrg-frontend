const EMIRecordsList = ({ loans, loading, page, totalPages, onPageChange, onViewSchedule }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No loans found.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">EMI</th>
              <th className="px-4 py-3 text-left">Tenure</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
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
                <td className="px-4 py-2">₹{loan.amount?.toLocaleString()}</td>
                <td className="px-4 py-2">₹{loan.emiAmount?.toLocaleString()}</td>
                <td className="px-4 py-2">{loan.tenureMonths} m</td>
                <td className="px-4 py-2">{loan.startDate || '-'}</td>
                <td className="px-4 py-2">{loan.endDate || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    loan.status === 'active' ? 'bg-green-100 text-green-800' :
                    loan.status === 'disbursed' ? 'bg-blue-100 text-blue-800' :
                    loan.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    loan.status === 'settled' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onViewSchedule(loan.id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition text-xs"
                  >
                    View Schedule
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

export default EMIRecordsList;