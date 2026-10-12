const AttendanceList = ({ records, loading, page, totalPages, onPageChange, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-8">Loading attendance records...</div>;
  }

  const getStatusBadge = (status) => {
    const colors = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      leave: 'bg-yellow-100 text-yellow-800',
      holiday: 'bg-blue-100 text-blue-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No attendance records found.</p>
          <p className="text-sm">Click <strong>+ Mark Attendance</strong> to add a record.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Employee</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Remark</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{r.employeeName}</div>
                  <div className="text-xs text-gray-500">{r.employeeId}</div>
                </td>
                <td className="px-4 py-2">{r.attendanceDate}</td>
                <td className="px-4 py-2">
                  <span className={getStatusBadge(r.status)}>{r.status}</span>
                </td>
                <td className="px-4 py-2">{r.branch || '-'}</td>
                <td className="px-4 py-2">{r.remark || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
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

export default AttendanceList;