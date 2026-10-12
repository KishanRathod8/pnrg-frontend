import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-brand text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <img src={logo} alt="PNRG Finance" className="h-10 bg-white/10 p-1 rounded-lg object-contain" />
        <span className="text-xl font-bold">PNRG <span className="font-light">FINANCE</span></span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm opacity-90">👤 {user?.code}</span>
        <button
          onClick={logout}
          className="bg-white/20 px-4 py-1 rounded-full text-sm hover:bg-white/30 transition"
        >
          ✕ Logout
        </button>
      </div>
    </header>
  );
};

export default Header;