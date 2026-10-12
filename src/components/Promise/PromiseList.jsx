const PromiseList = ({ promises, loading, page, totalPages, onPageChange, onEdit, onDelete, onStatusUpdate }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {promises.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🤝</div>
          <p>No promises found.</p>
          <p className="text-sm">Click <strong>+ New Promise</strong> to create one.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Promise Date</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promises.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.loanIdDisplay || p.loanId}</td>
                <td className="px-4 py-2">
                  <div className="font-medium">{p.memberName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{p.memberCode || p.memberId}</div>
                </td>
                <td className="px-4 py-2">₹{p.amount?.toLocaleString()}</td>
                <td className="px-4 py-2">{p.promiseDate}</td>
                <td className="px-4 py-2">{p.branch || '-'}</td>
                <td className="px-4 py-2 max-w-xs truncate">{p.promiseNote || '-'}</td>
                <td className="px-4 py-2">
                  <span className={getStatusBadge(p.status)}>{p.status}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  {p.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(p.id, 'completed')}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-green-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => onStatusUpdate(p.id, 'cancelled')}
                        className="bg-red-600 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onEdit(p)}
                    className="text-blue-600 hover:text-blue-800 mr-1"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
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

export default PromiseList;