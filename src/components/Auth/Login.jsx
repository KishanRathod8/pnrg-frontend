import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoPlaceholder from '../../assets/logo.png';

const Login = () => {
  const [code, setCode] = useState('ADM01');
  const [password, setPassword] = useState('Fincare@2024');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(code, password);
      if (success) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const role = (user?.role || 'CUSTOMER').toUpperCase();
          console.log('🔍 User role:', role);

          const roleMap = {
            'ADMIN': '/admin/dashboard',
            'MANAGER': '/manager/dashboard',
            'FIELD_OFFICER': '/field-officer/dashboard',
            'STAFF': '/staff/dashboard',
            'CUSTOMER': '/customer/dashboard',
          };
          const redirectPath = roleMap[role] || '/customer/dashboard';
          navigate(redirectPath);
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Panel */}
      <div className="flex-1 bg-gradient-brand text-white flex flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-white/10 -top-20 -right-20" />
        <div className="absolute w-72 h-72 rounded-full bg-white/5 -bottom-16 -left-16" />
        <div className="relative z-10 max-w-md text-center">
          <img
            src={logoPlaceholder}
            alt="PNRG Finance"
            className="h-16 mx-auto mb-6 bg-white/10 p-2 rounded-xl backdrop-blur object-contain"
          />
          <h1 className="text-4xl font-bold">Welcome <span className="font-light">back</span></h1>
          <p className="text-lg opacity-90 mt-2">Secure access to your microfinance dashboard</p>
          <div className="mt-8 text-left space-y-3 text-sm opacity-90">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">✓</span>
              Real‑time loan tracking
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">✓</span>
              CIBIL &amp; collection reports
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">✓</span>
              Multi‑branch accounting
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-brand-navy">Sign In</h2>
          <p className="text-gray-400 mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">👤 User Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none mb-4"
              required
            />

            <label className="block text-sm font-medium text-gray-700">🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent outline-none mb-4"
              required
            />

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <a href="#" className="text-sm text-brand-purple hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white font-bold py-3 rounded-full hover:scale-105 transition shadow-lg shadow-brand-pink/30 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'SIGN IN →'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Demo credentials pre‑filled — just click Sign In
            </p>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Don't have an account? </span>
              <Link to="/register" className="text-sm text-brand-pink hover:underline font-medium">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;