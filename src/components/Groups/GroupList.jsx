const GroupList = ({ groups, loading, page, totalPages, onPageChange, onEdit, onDelete }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {groups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📂</div>
          <p>No groups found.</p>
          <p className="text-sm">Click <strong>+ Add Group</strong> to create one.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Leader</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-center">Members</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{g.code}</td>
                <td className="px-4 py-2">{g.name}</td>
                <td className="px-4 py-2">{g.leader || '-'}</td>
                <td className="px-4 py-2">{g.branch || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-brand-pink/10 text-brand-pink px-2 py-1 rounded-full text-xs font-medium">
                    {g.memberCount || 0}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    g.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {g.status || 'active'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(g)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(g.id)}
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

export default GroupList;