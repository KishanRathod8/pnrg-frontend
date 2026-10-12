import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const CustomerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-brand text-white p-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <img src={logo} alt="PNRG Finance" className="h-8 bg-white/10 p-1 rounded-lg object-contain" />
        <span className="text-lg font-bold">PNRG <span className="font-light">FINANCE</span></span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm opacity-90">👤 {user?.name || 'Customer'}</span>
        <button
          onClick={handleLogout}
          className="bg-white/20 px-4 py-1 rounded-full text-sm hover:bg-white/30 transition"
        >
          ✕ Logout
        </button>
      </div>
    </header>
  );
};

export default CustomerHeader;