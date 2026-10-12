import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleLayout = ({ children, menuData, roleName }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-brand text-white p-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">PNRG <span className="font-light">FINANCE</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90">👤 {roleName}</span>
          <button onClick={handleLogout} className="bg-white/20 px-4 py-1 rounded-full text-sm hover:bg-white/30 transition">
            ✕ Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-brand-navy text-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto sidebar-scroll flex-shrink-0 hidden md:block">
          <div className="p-4 text-xs text-gray-400 border-b border-gray-700">
            SESSION: 2026-2027
            <div className="mt-1 text-brand-pink text-xs">{roleName} Portal</div>
          </div>
          {menuData.map((section) => (
            <div key={section.category}>
              <div className="px-4 pt-4 pb-1 text-xs font-bold text-brand-orange uppercase tracking-wider">
                {section.category}
              </div>
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm hover:bg-blue-900/50 transition border-l-3 ${
                      isActive ? 'bg-blue-900/50 border-l-4 border-brand-pink' : 'border-transparent'
                    }`
                  }
                >
                  <span className="mr-2">{item.icon}</span> {item.name}
                </NavLink>
              ))}
            </div>
          ))}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-700 mt-4">PNRG FINANCE v2.0</div>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RoleLayout;