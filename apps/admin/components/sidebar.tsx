'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  ShieldAlert,
  History,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Models', href: '/models', icon: UserSquare2, roles: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'] },
    { name: 'Assignments', href: '/assignments', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Audit Logs', href: '/audit', icon: History, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Reports', href: '/reports', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        Dating Admin
      </div>

      <nav className="flex-1 mt-6">
        {filteredItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-6 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
              pathname === item.href && "bg-gray-800 text-white border-r-4 border-indigo-500"
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-4">
          Logged in as: <br />
          <span className="text-white font-medium">{user?.displayName}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center text-red-400 hover:text-red-300 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
