const CollectionList = ({ collections, loading, page, totalPages, onPageChange }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {collections.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">💰</div>
          <p>No collection records found.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Loan ID</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment Date</th>
              <th className="px-4 py-3 text-left">Payment Mode</th>
              <th className="px-4 py-3 text-left">Balance After</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Received By</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{c.memberName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{c.memberCode || c.memberId}</div>
                </td>
                <td className="px-4 py-2">{c.loanIdDisplay || c.loanId}</td>
                <td className="px-4 py-2">₹{c.amount?.toLocaleString()}</td>
                <td className="px-4 py-2">{c.paymentDate}</td>
                <td className="px-4 py-2">{c.paymentMode || 'cash'}</td>
                <td className="px-4 py-2">₹{c.loanBalanceAfter?.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-2">{c.receivedBy || '-'}</td>
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

export default CollectionList;