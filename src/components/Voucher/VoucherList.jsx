const VoucherList = ({ vouchers, loading, page, totalPages, onPageChange, onEdit, onView, onDelete }) => {
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {vouchers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📒</div>
          <p>No vouchers found.</p>
          <p className="text-sm">Click <strong>+ New Voucher</strong> to create one.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Voucher No</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Narration</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Created By</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{v.voucherNo}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    v.voucherType === 'PAYMENT' ? 'bg-red-100 text-red-800' :
                    v.voucherType === 'RECEIPT' ? 'bg-green-100 text-green-800' :
                    v.voucherType === 'CONTRA' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {v.voucherType}
                  </span>
                </td>
                <td className="px-4 py-2">{v.voucherDate}</td>
                <td className="px-4 py-2 truncate max-w-xs">{v.narration || '-'}</td>
                <td className="px-4 py-2">{v.branch || '-'}</td>
                <td className="px-4 py-2">{v.createdBy || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onView(v)}
                    className="text-gray-600 hover:text-gray-800 mr-1"
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onEdit(v)}
                    className="text-blue-600 hover:text-blue-800 mr-1"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
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

export default VoucherList;