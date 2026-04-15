'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    bio: '',
    hourly_rate: 0,
    location: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);

      // Try to load provider profile
      const { data } = await supabase
        .from('providers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          bio: data.bio || '',
          hourly_rate: data.hourly_rate || 0,
          location: data.location || ''
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);

    const { error } = await supabase
      .from('providers')
      .update({
        bio: formData.bio,
        hourly_rate: formData.hourly_rate,
        location: formData.location
      })
      .eq('id', user.id);

    if (error) {
      alert('Failed to save: ' + error.message);
    } else {
      alert('✅ Profile updated successfully!');
      setIsEditing(false);

      // Refresh data
      const { data } = await supabase
        .from('providers')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
                disabled={saving}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <p className="text-xl text-gray-900">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-xl text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p className="text-xl text-gray-900 capitalize">{user?.user_metadata?.role || 'Client'}</p>
              </div>

              {/* Provider fields */}
              {profile && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900"
                      />
                    ) : (
                      <p className="text-xl text-gray-900">{profile.location || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={formData.hourly_rate}
                        onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">${profile.hourly_rate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        rows={5}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900"
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{profile.bio || 'No bio added yet.'}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-10 w-full bg-blue-600 text-white py-4 rounded-3xl font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}