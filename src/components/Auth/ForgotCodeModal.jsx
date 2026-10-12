import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotCodeModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile) return toast.error('Please enter your mobile number');
    setLoading(true);
    try {
      await api.post('/auth/send-code-otp', { mobile });
      toast.success('OTP sent to your mobile');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/get-user-code', { mobile, otp });
      setUserCode(res.data.code);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-brand-navy mb-4">Get Your User Code</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter registered mobile"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <p className="text-sm text-gray-600 mb-4">
              OTP sent to <strong>{mobile}</strong>
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
            >
              {loading ? 'Verifying...' : 'Get Code'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Your user code is:</p>
            <p className="text-2xl font-bold text-brand-navy my-3">{userCode}</p>
            <p className="text-xs text-gray-400">Use this code to login</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        )}
        {step !== 3 && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotCodeModal;