import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RoleForm = ({ role, permissions, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissionIds: role.permissionIds || role.permissions?.map(p => p.id) || [],
      });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => {
      const ids = prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId];
      return { ...prev, permissionIds: ids };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (role) {
        await api.put(`/roles-permissions/roles/${role.id}`, formData);
        toast.success('Role updated successfully');
      } else {
        await api.post('/roles-permissions/roles', formData);
        toast.success('Role created successfully');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((groups, p) => {
    const category = p.category || 'General';
    if (!groups[category]) groups[category] = [];
    groups[category].push(p);
    return groups;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-brand-navy mb-4">
          {role ? 'Edit Role' : 'Add New Role'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., SUPER_ADMIN"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Role description"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-brand-navy mb-2">Permissions</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.keys(groupedPermissions).map((category) => (
                <div key={category}>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{category}</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {groupedPermissions[category].map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={formData.permissionIds.includes(p.id)}
                          onChange={() => handlePermissionToggle(p.id)}
                          className="w-4 h-4 text-brand-pink focus:ring-brand-pink"
                        />
                        <span>{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Selected: {formData.permissionIds.length} permission(s)
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : role ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;