import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    code: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    pincode: '',
    branch: '',
  });
  const [originalProfile, setOriginalProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer/profile');
      const data = res.data;
      setProfile({
        id: data.id || '',
        code: data.code || '',
        name: data.name || '',
        mobile: data.mobile || '',
        email: data.email || '',
        address: data.address || '',
        state: data.state || '',
        pincode: data.pincode || '',
        branch: data.branch || '',
      });
      setOriginalProfile({
        id: data.id || '',
        code: data.code || '',
        name: data.name || '',
        mobile: data.mobile || '',
        email: data.email || '',
        address: data.address || '',
        state: data.state || '',
        pincode: data.pincode || '',
        branch: data.branch || '',
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel - revert to original
      setProfile(originalProfile);
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        address: profile.address,
        state: profile.state,
        pincode: profile.pincode,
      };
      await api.put('/customer/profile', payload);
      toast.success('Profile updated successfully!');
      setIsEditMode(false);
      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>
        <button
          onClick={handleEditToggle}
          className={`px-4 py-2 rounded-lg transition ${
            isEditMode
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gradient-brand text-white hover:scale-105'
          }`}
        >
          {isEditMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit}>
          {/* User Code - Read Only */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">User Code</p>
            <p className="font-medium text-brand-navy">{profile.code || '-'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isEditMode ? 'border-gray-300' : 'border-transparent bg-gray-50'
                }`}
                required
              />
            </div>

            {/* Mobile - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                value={profile.mobile || '-'}
                disabled
                className="w-full p-2 border border-transparent bg-gray-50 rounded-lg"
              />
              <p className="text-xs text-gray-400 mt-1">Mobile number cannot be changed</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isEditMode ? 'border-gray-300' : 'border-transparent bg-gray-50'
                }`}
              />
            </div>

            {/* Branch - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="text"
                value={profile.branch || '-'}
                disabled
                className="w-full p-2 border border-transparent bg-gray-50 rounded-lg"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={profile.address || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                rows="2"
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isEditMode ? 'border-gray-300' : 'border-transparent bg-gray-50'
                }`}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={profile.state || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isEditMode ? 'border-gray-300' : 'border-transparent bg-gray-50'
                }`}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profile.pincode || ''}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isEditMode ? 'border-gray-300' : 'border-transparent bg-gray-50'
                }`}
                pattern="\d{6}"
                title="6-digit pincode"
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditMode && (
            <div className="mt-6 flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfile(originalProfile);
                  toast.info('Changes discarded');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;