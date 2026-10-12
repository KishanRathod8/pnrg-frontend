import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: mobile, 2: otp, 3: details

  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // ─── 1. Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }

    const fullMobile = countryCode + mobile;
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { mobile: fullMobile });
      toast.success(`OTP sent to ${fullMobile}`);
      setStep(2);
      // Start resend timer
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. Verify OTP (just move to step 3 – no backend call) ──
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }
    // ✅ We don't call /verify-otp here – the registration endpoint will verify the OTP
    setStep(3);
    toast.success('OTP accepted. Now complete your details.');
  };

  // ─── 3. Register (Create Account) ──────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const fullMobile = countryCode + mobile;
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        mobile: fullMobile,
        email: formData.email,
        password: formData.password,
        otp: otp, // ✅ OTP is sent here – it will be verified by the backend
      };
      const res = await api.post('/auth/register', payload);
      toast.success('Registration successful!');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ──────────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const fullMobile = countryCode + mobile;
    try {
      await api.post('/auth/resend-otp', { mobile: fullMobile });
      toast.success('OTP resent!');
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-brand-navy mb-6">
          Create Account
        </h1>

        {/* STEP 1: Mobile + Country Code */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent bg-white"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+86">+86 (CN)</option>
                </select>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                You'll receive an SMS with a 6-digit OTP.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-pink hover:underline">
                Login
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2: OTP Entry (no separate verification call) */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit OTP sent to <strong>{countryCode + mobile}</strong>
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
            >
              Verify OTP
            </button>
            <div className="flex justify-between mt-3 text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:underline"
              >
                ← Change number
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`text-brand-pink hover:underline ${
                  resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Account Details */}
        {step === 3 && (
          <form onSubmit={handleRegister}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;