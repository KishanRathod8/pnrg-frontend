    const LeaveList = ({ leaves, loading, page, totalPages, onPageChange, onEdit, onDelete, onStatusUpdate }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Employee</th>
            <th className="px-4 py-3 text-left">Leave Type</th>
            <th className="px-4 py-3 text-left">Start Date</th>
            <th className="px-4 py-3 text-left">End Date</th>
            <th className="px-4 py-3 text-left">Branch</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">No leave records found</td>
            </tr>
          ) : (
            leaves.map((l) => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{l.employeeName}</div>
                  <div className="text-xs text-gray-500">{l.employeeId}</div>
                </td>
                <td className="px-4 py-2">{l.leaveType}</td>
                <td className="px-4 py-2">{l.startDate}</td>
                <td className="px-4 py-2">{l.endDate}</td>
                <td className="px-4 py-2">{l.branch || '-'}</td>
                <td className="px-4 py-2">
                  <span className={getStatusBadge(l.status)}>{l.status || 'pending'}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  {l.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusUpdate(l.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-1 hover:bg-green-600"
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
                  <button
                    onClick={() => onEdit(l)}
                    className="text-blue-600 hover:text-blue-800 mr-1"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(l.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
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

export default LeaveList;