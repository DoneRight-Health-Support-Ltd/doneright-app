'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'client' | 'provider' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      const userRole = user.user_metadata?.role as 'client' | 'provider';
      setRole(userRole || 'client');
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="ml-64 min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                  {role === 'provider' 
                    ? 'Thank you for being part of DoneRight’s provider network' 
                    : 'We’re here to support your mental wellness journey'}
                </p>
              </div>
              <span className={`inline-block px-5 py-2 rounded-2xl text-sm font-medium ${role === 'provider' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                {role === 'provider' ? '✅ Verified Provider' : 'Client'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {role === 'provider' && (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">Your Clients</h3>
                    <p className="text-6xl font-bold text-emerald-600">0</p>
                    <p className="text-gray-600 mt-2">Active this month</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">Upcoming Sessions</h3>
                    <p className="text-6xl font-bold text-blue-600">0</p>
                    <p className="text-gray-600 mt-2">Next session</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-4">Quick Actions</h3>
                    <div className="mt-6 space-y-4 text-blue-600">
                      <a href="/onboarding" className="block hover:underline">→ Complete your profile</a>
                      <a href="/providers" className="block hover:underline">→ Browse all providers</a>
                      <a href="/resources" className="block hover:underline">→ Open Resource Library</a>
                      <a href="/sessions" className="block hover:underline">→ View My Sessions</a>
                      <a href="/profile" className="block hover:underline">→ View My Profile</a>
                    </div>
                  </div>
                </>
              )}

              {role === 'client' && (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">Find a Provider</h3>
                    <p className="text-emerald-600">Get matched with the right professional</p>
                    <a href="/providers" className="mt-6 block w-full text-center bg-emerald-600 text-white py-4 rounded-3xl font-medium hover:bg-emerald-700">
                      Browse Providers
                    </a>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-3">Resource Library</h3>
                    <p className="text-gray-600">Access free worksheets and tools</p>
                    <a href="/resources" className="mt-6 block w-full text-center bg-white border border-gray-300 py-4 rounded-3xl hover:bg-gray-50">
                      Open Resources →
                    </a>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                    <h3 className="font-semibold text-xl text-gray-900 mb-4">How are you feeling today?</h3>
                    <div className="mt-8 grid grid-cols-5 gap-4 text-5xl">
                      {['😊', '🙂', '😐', '🙁', '😢'].map((emoji) => (
                        <button key={emoji} className="hover:scale-125 transition">{emoji}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}