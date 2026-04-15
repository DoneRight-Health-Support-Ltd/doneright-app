'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function ProviderOnboarding() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    qualifications: '',
    affiliations: '',
    specialties: '',
    location: '',
    languages: [] as string[],
    bio: '',
    hourly_rate: 0,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const languageOptions = ['English', 'Yoruba', 'Hausa', 'French', 'Igbo', 'Pidgin'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in');

      // Upload verification documents
      const uploadedDocs: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('verification-docs')
          .upload(fileName, file);
        if (error) throw error;
        uploadedDocs.push(data.path);
      }

      // Save provider profile
      const { error } = await supabase
        .from('providers')
        .insert({
          id: user.id,
          qualifications: formData.qualifications.split(',').map(s => s.trim()).filter(Boolean),
          affiliations: formData.affiliations.split(',').map(s => s.trim()).filter(Boolean),
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
          location: formData.location,
          languages: formData.languages,
          bio: formData.bio,
          hourly_rate: formData.hourly_rate,        // stored in USD
          verification_docs: uploadedDocs,
          is_verified: false,
        });

      if (error) throw error;

      setMessage('✅ Onboarding submitted successfully! Your profile is under review.');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Protect the page
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/');
      }
    });
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Onboarding</h1>
            <p className="text-gray-600 mb-8">Help us verify you so you can start helping clients across Africa</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualifications</label>
                <input
                  type="text"
                  name="qualifications"
                  placeholder="MSc Clinical Psychology, BSc"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Affiliations</label>
                <input
                  type="text"
                  name="affiliations"
                  placeholder="Nigerian Psychological Association, NACP"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialties (separate with commas)</label>
                <input
                  type="text"
                  name="specialties"
                  placeholder="PTSD, Anxiety, Child Psychology, Trauma"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City / State</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Lagos, Nigeria"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            languages: prev.languages.includes(lang)
                              ? prev.languages.filter(l => l !== lang)
                              : [...prev.languages, lang]
                          }));
                        }}
                        className={`px-4 py-2 text-sm rounded-2xl border ${formData.languages.includes(lang) ? 'bg-blue-600 text-white' : 'border-gray-300 text-gray-700'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Tell clients about your experience, approach, and why you do this work..."
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
                <input
                  type="number"
                  name="hourly_rate"
                  placeholder="25"
                  step="0.01"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter amount in US Dollars ($)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Verification Documents (licenses, certificates, ID)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.png"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-2">You can upload multiple files</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-3xl transition disabled:opacity-50"
              >
                {loading ? 'Submitting for Review...' : 'Submit Onboarding & Get Verified'}
              </button>
            </form>

            {message && (
              <div className="mt-6 text-center text-sm font-medium p-4 rounded-2xl bg-gray-100 text-gray-800">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}