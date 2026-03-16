import React, { useState, useEffect } from 'react';
import image from '../assets/Icon.png';
import { Settings, FileText, Package, ShoppingCart, LayoutDashboard, LogOut, Wifi, WifiOff, Bell } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { id: 1, name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { id: 2, name: 'Caisse (POS)', path: '/pos', icon: ShoppingCart },
    { id: 3, name: 'Produits et Stock', path: '/products', icon: Package },
    { id: 4, name: 'Factures', path: '/invoices', icon: FileText },
    { id: 5, name: 'Parametres', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-60 bg-slate-900 text-slate-100 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-400 shadow-xl z-50">
      <div className="flex border-b border-slate-600 items-center gap-4 p-4">
        <img src={image} alt="Logo" className="h-6" />
        <span className="text-xl font-bold">ShopDesk</span>
      </div>

      <nav className="flex-1 p-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.id} // ✅ fix: unique key
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">{item.name}</span>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-600 p-2">
        <button className="flex items-center hover:bg-slate-800 hover:text-red-400 text-slate-400 p-4 py-3 gap-2 w-full rounded-lg transition-colors duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  const { user, loading } = useAuth(); // ✅ fix: useAuth imported
  const [isOnline, setIsOnline] = useState(navigator.onLine); // ✅ fix: no zustand needed

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isOnline ? 'En ligne' : 'Hors ligne'}</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
          {loading ? (
            <div className="w-32 h-8 bg-slate-100 rounded animate-pulse" />
          ) : (
            <>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-700">{user?.name ?? 'Utilisateur'}</p>
                <p className="text-xs text-slate-500">{user?.boutiqueName ?? 'Boutique'}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-600 font-bold text-sm">{initials}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-1 min-h-screen bg-slate-50">
        <Header />
        <main className="p-6">
          {children} {/* ✅ renders your pages here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;