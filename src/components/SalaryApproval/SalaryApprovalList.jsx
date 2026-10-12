const SalaryApprovalList = ({ salaries, loading, page, totalPages, onPageChange, onApprove, onReject }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {salaries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">💰</div>
          <p>No salary requests found.</p>
          <p className="text-sm">Click <strong>+ Request Salary</strong> to create one.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Month</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment Mode</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{salary.employeeName}</div>
                  <div className="text-xs text-gray-500">{salary.employeeId}</div>
                </td>
                <td className="px-4 py-2">{salary.month}</td>
                <td className="px-4 py-2">₹{salary.amount?.toLocaleString()}</td>
                <td className="px-4 py-2">{salary.paymentMode || '-'}</td>
                <td className="px-4 py-2">{salary.branch || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    salary.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    salary.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {salary.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {salary.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(salary.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition mr-2 text-xs"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => onReject(salary.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-xs"
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {salary.status !== 'pending' && (
                    <span className="text-xs text-gray-400">Processed</span>
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

export default SalaryApprovalList;