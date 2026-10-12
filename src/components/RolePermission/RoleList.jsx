const RoleList = ({ roles, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      {roles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">👥</div>
          <p>No roles found.</p>
          <p className="text-sm">Click <strong>+ Add Role</strong> to create one.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Role Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Users</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-brand-pink">{role.name}</td>
                <td className="px-4 py-2">{role.description || '-'}</td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {role.userCount || 0}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.slice(0, 3).map((p) => (
                      <span key={p.id} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {p.name}
                      </span>
                    ))}
                    {role.permissions && role.permissions.length > 3 && (
                      <span className="text-gray-400 text-xs">+{role.permissions.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(role)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(role.id)}
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
    </div>
  );
};

export default RoleList;