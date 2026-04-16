'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/providers', label: 'Find Providers', icon: '🔍' },
  { href: '/resources', label: 'Resources', icon: '📚' },
  { href: '/sessions', label: 'My Sessions', icon: '📅' },
  { href: '/notifications', label: 'Notifications', icon: '🛎️' },
  { href: '/profile', label: 'My Profile', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 pt-8 hidden lg:block overflow-y-auto">
      <div className="px-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                pathname === item.href 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 px-4">
          <Link
            href="/onboarding"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            ⚙️ Provider Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
}