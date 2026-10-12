import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerKyc = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    state: '',
    pincode: '',
    aadhar: '',
    pan: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    setLoading(true);
    try {
      const [statusRes, detailsRes] = await Promise.all([
        api.get('/customer/kyc-status'),
        api.get('/customer/kyc-details'),
      ]);
      setKycStatus(statusRes.data);
      const data = detailsRes.data;
      setKycDetails(data);
      // Pre-fill form
      setFormData({
        address: data.address || '',
        state: data.state || '',
        pincode: data.pincode || '',
        aadhar: data.aadhar || '',
        pan: data.pan || '',
      });
    } catch (err) {
      console.error('Failed to fetch KYC data:', err);
      toast.error('Could not load KYC data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = 'Aadhar must be 12 digits';
    }
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        address: formData.address,
        state: formData.state,
        pincode: formData.pincode,
        aadhar: formData.aadhar,
        pan: formData.pan,
      };
      const res = await api.post('/customer/kyc', payload);
      toast.success(res.data.message || 'KYC submitted successfully!');
      // Refresh KYC data
      await fetchKycData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Action Required',
      SUBMITTED: 'Under Review',
      VERIFIED: 'Approved ✅',
      REJECTED: 'Rejected ❌',
    };
    return texts[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading KYC details...</p>
        </div>
      </div>
    );
  }

  const isVerified = kycStatus?.status === 'VERIFIED';
  const isSubmitted = kycStatus?.status === 'SUBMITTED';
  const isRejected = kycStatus?.status === 'REJECTED';
  const isPending = kycStatus?.status === 'PENDING' || !kycStatus?.status;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-brand-navy">KYC Details</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(kycStatus?.status || 'PENDING')}`}>
            {kycStatus?.status || 'PENDING'} – {getStatusText(kycStatus?.status || 'PENDING')}
          </span>
        </div>
      </div>

      {/* Status Banners */}
      {isVerified && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
          <p className="text-green-700 font-medium">✅ KYC Verified</p>
          <p className="text-green-600 text-sm">Your KYC has been verified. You can now apply for loans.</p>
        </div>
      )}

      {isRejected && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <p className="text-red-700 font-medium">❌ KYC Rejected</p>
          <p className="text-red-600 text-sm">Your KYC was rejected. Please re-submit with correct documents.</p>
        </div>
      )}

      {isSubmitted && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <p className="text-blue-700 font-medium">⏳ KYC Under Review</p>
          <p className="text-blue-600 text-sm">Your KYC is being reviewed by our team. You will be notified once verified.</p>
        </div>
      )}

      {isPending && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <p className="text-yellow-700 font-medium">📋 KYC Required</p>
          <p className="text-yellow-600 text-sm">Please complete your KYC to unlock loan applications and full portal access.</p>
        </div>
      )}

      {/* KYC Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-brand-navy mb-4">
          {isVerified ? 'Your KYC Details (Verified)' : isSubmitted ? 'KYC Under Review' : 'Submit KYC Details'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                disabled={isVerified || isSubmitted}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                disabled={isVerified || isSubmitted}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your state"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                pattern="\d{6}"
                disabled={isVerified || isSubmitted}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 6-digit pincode"
                title="Pincode must be 6 digits"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                pattern="\d{12}"
                disabled={isVerified || isSubmitted}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.aadhar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 12-digit Aadhar"
                title="Aadhar must be 12 digits"
              />
              {errors.aadhar && <p className="text-red-500 text-xs mt-1">{errors.aadhar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">PAN Number</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                disabled={isVerified || isSubmitted}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.pan ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter valid PAN (e.g., ABCDE1234F)"
                title="PAN must be in format: ABCDE1234F"
              />
              {errors.pan && <p className="text-red-500 text-xs mt-1">{errors.pan}</p>}
            </div>
          </div>

          {!isVerified && !isSubmitted && (
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-brand text-white px-6 py-2 rounded-lg hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
                {submitting ? 'Submitting...' : 'Submit KYC'}
              </button>
            </div>
          )}

          {(isVerified || isSubmitted) && (
            <div className="mt-4 text-sm text-gray-500">
              {isVerified && '✅ Your KYC is verified. No further action required.'}
              {isSubmitted && '⏳ Your KYC is under review. Please wait for verification.'}
            </div>
          )}
        </form>
      </div>

      {/* KYC Requirements */}
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">KYC Requirements</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-500">
          <li>• Address proof – Current residential address</li>
          <li>• Identity proof – Aadhar card (12-digit)</li>
          <li>• PAN card – For financial verification</li>
          <li>• All documents must be valid and match your profile</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerKyc;