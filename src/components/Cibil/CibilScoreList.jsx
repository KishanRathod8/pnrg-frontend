const CibilScoreList = ({ scores, loading, page, totalPages, onPageChange, onEdit }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600 font-bold';
    if (score >= 600) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {scores.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No CIBIL scores found.</p>
          <p className="text-sm">Click <strong>+ Add/Update Score</strong> to enter a score.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">ID Proof</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Score</th>
              <th className="px-4 py-3 text-left">Report Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Remarks</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{s.memberName || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{s.memberCode || s.memberId}</div>
                </td>
                <td className="px-4 py-2">{s.pan || s.aadhar || '-'}</td>
                <td className="px-4 py-2">{s.branch || '-'}</td>
                <td className={`px-4 py-2 ${getScoreColor(s.score)}`}>{s.score ?? 'N/A'}</td>
                <td className="px-4 py-2">{s.reportDate}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.status === 'active' ? 'bg-green-100 text-green-800' :
                    s.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {s.status || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2">{s.remarks || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(s)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
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

export default CibilScoreList;