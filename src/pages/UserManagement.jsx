import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    roleId: '',
    branch: '',
    active: true,
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ─── Fetch Data ──────────────────────────────────────────────
  const fetchUsers = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { page: pageNum, size: 10 } });
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles-permissions/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('Failed to load roles', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches/active');
      setBranches(res.data);
    } catch (err) {
      console.error('Failed to load branches', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchBranches();
  }, []);

  // ─── Form Handling ────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      email: '',
      mobile: '',
      password: '',
      roleId: '',
      branch: '',
      active: true,
    });
    setEditingUser(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      code: user.code || '',
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      roleId: user.roleIds?.[0] || '',
      branch: user.branch || '',
      active: user.active !== undefined ? user.active : true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        active: formData.active,
        roleIds: formData.roleId ? [parseInt(formData.roleId)] : [],
        branch: formData.branch,
      };
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
        toast.success('User updated successfully');
      } else {
        // On create, we need to send password
        if (!formData.password) {
          toast.error('Password is required for new users');
          return;
        }
        await api.post('/users', { ...payload, password: formData.password });
        toast.success('User created successfully');
      }
      setShowForm(false);
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted');
        fetchUsers(page);
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">User Management</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add User
        </button>
      </div>

      {/* ─── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Branch</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{u.code}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email || '-'}</td>
                <td className="px-4 py-2">{u.mobile || '-'}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {u.role || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-2">{u.branch || '-'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => fetchUsers(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal Form ────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-brand-navy mb-4">
              {editingUser ? 'Edit User' : 'New User'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required={!editingUser}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">None</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleFormChange}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;