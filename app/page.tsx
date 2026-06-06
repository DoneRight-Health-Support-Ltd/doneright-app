'use client';

import { useState } from 'react';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, role } },
        });
        if (error) throw error;
        setMessage('✅ Account created! Please check your email to confirm.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">DoneRight</h1>
            <p className="text-gray-600 mt-3">Mental Health Support for Africa</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setRole('client')} className={`flex-1 py-3 rounded-2xl border ${role === 'client' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>Client</button>
                    <button type="button" onClick={() => setRole('provider')} className={`flex-1 py-3 rounded-2xl border ${role === 'provider' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>Provider</button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-2xl" required />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-3xl transition disabled:opacity-50">
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-8">
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {message && <div className="mt-6 text-center text-sm p-4 bg-gray-100 rounded-2xl">{message}</div>}
        </div>
      </div>
    </>
  );
}