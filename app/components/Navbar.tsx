'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">DoneRight</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Africa</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">Home</Link>
            <Link href="/providers" className="text-gray-700 hover:text-gray-900 transition">Find Providers</Link>
            <Link href="/resources" className="text-gray-700 hover:text-gray-900 transition">Resources</Link>
            <Link href="/sessions" className="text-gray-700 hover:text-gray-900 transition">My Sessions</Link>
            <Link href="/notifications" className="text-gray-700 hover:text-gray-900 transition">Notifications</Link>
          </div>

          {/* User Area */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/profile" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link
                  href="/"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-2xl transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}