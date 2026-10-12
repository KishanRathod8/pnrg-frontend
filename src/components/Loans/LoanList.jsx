const LoanList = ({ loans, loading, page, totalPages, onPageChange, onStatusUpdate }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      settled: 'bg-purple-100 text-purple-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📄</div>
          <p>No loan applications found.</p>
          <p className="text-sm">Click <strong>+ Apply for Loan</strong> to start.</p>
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
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{l.loanId}</td>
                <td className="px-4 py-2">
                  <div className="font-medium">{l.memberName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{l.memberCode || l.memberId}</div>
                </td>
                <td className="px-4 py-2">{l.productName || 'N/A'}</td>
                <td className="px-4 py-2">₹{l.amount.toLocaleString()}</td>
                <td className="px-4 py-2">₹{l.emiAmount?.toLocaleString()}</td>
                <td className="px-4 py-2">{l.tenureMonths} months</td>
                <td className="px-4 py-2">{l.applicationDate}</td>
                <td className="px-4 py-2">
                  <span className={getStatusBadge(l.status)}>{l.status}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  {l.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(l.id, 'approved')}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-blue-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusUpdate(l.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {l.status === 'approved' && (
                    <button
                      onClick={() => onStatusUpdate(l.id, 'disbursed')}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Disburse
                    </button>
                  )}
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

export default LoanList;