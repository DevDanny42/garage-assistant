import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ClipboardList, 
  Package, 
  Receipt, 
  BarChart3, 
  Settings,
  LogOut,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Job Cards', href: '/job-cards', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wrench className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">AutoGarage</h1>
            <p className="text-xs text-sidebar-muted">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn('sidebar-link', isActive && 'active')
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-muted truncate capitalize">
                {user?.role || 'Staff'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
