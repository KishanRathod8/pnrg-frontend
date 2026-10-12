import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerKycDetails = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [panData, setPanData] = useState({ panNumber: '', name: '', category: '', aadhaarLinked: false });
  const [aadhaarData, setAadhaarData] = useState({ name: '', dob: '', gender: '', address: '' });
  const [panLoading, setPanLoading] = useState(false);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [kycUrl, setKycUrl] = useState('');
  const [requestId, setRequestId] = useState('');
  const [mockProcessing, setMockProcessing] = useState(false);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/kyc/my-status');
      setKycStatus(res.data.kycStatus || 'PENDING');
    } catch (err) {
      console.error('Failed to fetch KYC status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePanVerification = async (e) => {
    e.preventDefault();
    const pan = e.target.pan.value.toUpperCase();
    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      toast.error('Please enter a valid PAN number');
      return;
    }
    setPanLoading(true);
    try {
      const res = await api.post('/kyc/verify-pan', { panNumber: pan });
      if (res.data.success) {
        setPanData({
          panNumber: pan,
          name: res.data.name || 'N/A',
          category: res.data.category || 'N/A',
          aadhaarLinked: res.data.aadhaarLinked || false,
        });
        toast.success('PAN verified successfully!');
      } else {
        toast.error(res.data.message || 'PAN verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'PAN verification failed');
    } finally {
      setPanLoading(false);
    }
  };

  const handleAadhaarKyc = async () => {
    setAadhaarLoading(true);
    try {
      const res = await api.post('/kyc/start-aadhaar');
      const { kycUrl, requestId: reqId, status } = res.data;
      
      setKycUrl(kycUrl);
      setRequestId(reqId);

      // Check if we are in mock mode (mock URL contains 'mock-setu')
      if (kycUrl && kycUrl.includes('mock-setu')) {
        // In mock mode, simulate KYC completion without opening a window
        setMockProcessing(true);
        toast.info('Mock KYC is being processed...');

        // After 3 seconds, simulate success
        setTimeout(() => {
          setMockProcessing(false);
          // Mark KYC as completed
          setKycStatus('VERIFIED');
          setAadhaarData({
            name: 'Mock User',
            dob: '01-01-1990',
            gender: 'Male',
            address: '123 Mock Street, Mock District, Mock State - 123456',
          });
          toast.success('✅ Mock KYC completed successfully!');
          // Also call the backend to update status (optional)
          checkKycStatus(reqId);
        }, 3000);
      } else if (kycUrl && kycUrl !== 'null' && kycUrl !== '') {
        // Real mode: open the Setu page
        window.open(kycUrl, '_blank', 'width=800,height=600');
        toast.info('Please complete Aadhaar verification in the opened window');
        // Poll for status after 30 seconds
        setTimeout(() => {
          checkKycStatus(reqId);
        }, 30000);
      } else {
        toast.info('Aadhaar KYC request created. Check status later.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start Aadhaar KYC');
    } finally {
      setAadhaarLoading(false);
    }
  };

  const checkKycStatus = async (reqId) => {
    try {
      const res = await api.get(`/kyc/status/${reqId}`);
      const { status } = res.data;
      if (status === 'SUCCESS') {
        toast.success('Aadhaar KYC completed successfully!');
        setKycStatus('VERIFIED');
        if (res.data.data?.aadhaar) {
          setAadhaarData({
            name: res.data.data.aadhaar.name || 'N/A',
            dob: res.data.data.aadhaar.dateOfBirth || 'N/A',
            gender: res.data.data.aadhaar.gender || 'N/A',
            address: (res.data.data.aadhaar.address?.house || '') + ', ' + 
                      (res.data.data.aadhaar.address?.district || '') || 'N/A',
          });
        }
      } else if (status === 'KYC_REQUESTED') {
        toast.info('KYC is in progress. Please complete the verification.');
      } else {
        toast.info(`KYC status: ${status}`);
      }
    } catch (err) {
      console.error('Failed to check KYC status:', err);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUBMITTED: 'bg-blue-100 text-blue-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">Loading KYC details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-navy mb-4">KYC Verification</h1>

      {/* Status Card */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <span className={getStatusBadge(kycStatus)}>{kycStatus}</span>
          </div>
          <p className="text-sm text-gray-600">
            {kycStatus === 'VERIFIED'
              ? '✅ KYC Verified. You can now apply for loans.'
              : 'Complete KYC to unlock loan applications.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAN Verification */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-brand-navy mb-3">PAN Verification</h2>
          {panData.name ? (
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">PAN:</span> <strong>{panData.panNumber}</strong></div>
              <div><span className="text-gray-500">Name:</span> <strong>{panData.name}</strong></div>
              <div><span className="text-gray-500">Category:</span> <strong>{panData.category}</strong></div>
              <div>
                <span className="text-gray-500">Aadhaar Linked:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${panData.aadhaarLinked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {panData.aadhaarLinked ? 'Yes' : 'No'}
                </span>
              </div>
              <button
                onClick={() => setPanData({ panNumber: '', name: '', category: '', aadhaarLinked: false })}
                className="mt-2 text-sm text-brand-pink hover:underline"
              >
                Re-verify PAN
              </button>
            </div>
          ) : (
            <form onSubmit={handlePanVerification}>
              <input
                type="text"
                name="pan"
                placeholder="Enter PAN (e.g., ABCDE1234F)"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent mb-3"
                required
              />
              <button
                type="submit"
                disabled={panLoading}
                className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
              >
                {panLoading ? 'Verifying...' : 'Verify PAN'}
              </button>
            </form>
          )}
        </div>

        {/* Aadhaar Verification */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-brand-navy mb-3">Aadhaar Verification</h2>
          {aadhaarData.name ? (
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Name:</span> <strong>{aadhaarData.name}</strong></div>
              <div><span className="text-gray-500">DOB:</span> <strong>{aadhaarData.dob}</strong></div>
              <div><span className="text-gray-500">Gender:</span> <strong>{aadhaarData.gender}</strong></div>
              <div><span className="text-gray-500">Address:</span> <strong>{aadhaarData.address}</strong></div>
            </div>
          ) : (
            <div className="text-center py-4">
              {mockProcessing ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">Processing mock KYC...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3">
                    Click below to start Aadhaar verification via Setu.
                    You will be redirected to complete the process.
                  </p>
                  <button
                    onClick={handleAadhaarKyc}
                    disabled={aadhaarLoading}
                    className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
                  >
                    {aadhaarLoading ? 'Starting...' : 'Start Aadhaar KYC'}
                  </button>
                </>
              )}
              {requestId && !mockProcessing && (
                <button
                  onClick={() => checkKycStatus(requestId)}
                  className="mt-2 text-sm text-brand-pink hover:underline"
                >
                  Check Status
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerKycDetails;