import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
  { name: 'Materials', path: '/admin/materials', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  // Future pages
  // { name: 'Customers', path: '/admin/customers', icon: Users },
  // { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white sticky top-0 h-screen flex flex-col shadow-sm transition-all duration-300">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-xl font-serif text-emerald-900 font-bold tracking-tight">Admin Portal</h2>
          <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mt-1">Subicharan Tex</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn("transition-colors", "group-hover:text-emerald-500")} />
                {item.name}
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/30">
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-800 truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-sm text-zinc-500 uppercase tracking-widest font-bold">
            <button 
              onClick={() => navigate(-1)}
              className="mr-2 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-lg transition-colors font-medium text-xs"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <span className="text-zinc-300">/</span>
            Admin <span className="text-zinc-300">/</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-zinc-200" />
            <div className="text-xs text-zinc-400 font-medium italic">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
