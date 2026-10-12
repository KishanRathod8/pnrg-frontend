const PermissionList = ({ permissions }) => {
  // Group by category
  const grouped = permissions.reduce((groups, p) => {
    const category = p.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push(p);
    return groups;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🔐</div>
          <p>No permissions found.</p>
        </div>
      ) : (
        Object.keys(grouped).map((category) => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-sm font-bold text-brand-navy border-b pb-1 mb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {grouped[category].map((p) => (
                <div key={p.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">{p.name}</span>
                  {p.description && (
                    <span className="text-xs text-gray-400">({p.description})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PermissionList;