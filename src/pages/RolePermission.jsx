import { useState, useEffect } from 'react';
import api from '../services/api';
import RoleList from '../components/RolePermission/RoleList';
import RoleForm from '../components/RolePermission/RoleForm';
import PermissionList from '../components/RolePermission/PermissionList';
import toast from 'react-hot-toast';

const RolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [activeTab, setActiveTab] = useState('roles');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        api.get('/roles-permissions/roles'),
        api.get('/roles-permissions/permissions')
      ]);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.delete(`/roles-permissions/roles/${id}`);
        toast.success('Role deleted successfully');
        fetchData();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete role');
      }
    }
  };

  const handleFormClose = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  const handleFormSave = () => {
    fetchData();
    setShowRoleForm(false);
    setEditingRole(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Role & Permission</h1>
        {activeTab === 'roles' && (
          <button
            onClick={handleAddRole}
            className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            + Add Role
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'roles'
              ? 'bg-gradient-brand text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          👥 Roles ({roles.length})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'permissions'
              ? 'bg-gradient-brand text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          🔐 Permissions ({permissions.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : activeTab === 'roles' ? (
        <RoleList
          roles={roles}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      ) : (
        <PermissionList permissions={permissions} />
      )}

      {showRoleForm && (
        <RoleForm
          role={editingRole}
          permissions={permissions}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default RolePermission;