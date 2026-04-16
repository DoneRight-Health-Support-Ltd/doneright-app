'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

type Provider = {
  id: string;
  full_name: string;
  specialties: string[];
  location: string;
  languages: string[];
  bio: string;
  hourly_rate: number;
  is_verified: boolean;
};

const sampleProviders: Provider[] = [
  {
    id: '1',
    full_name: 'Dr. Adebayo Okafor',
    specialties: ['Anxiety', 'Depression', 'Trauma'],
    location: 'Lagos, Nigeria',
    languages: ['English', 'Yoruba'],
    bio: 'Specializes in trauma healing and culturally sensitive therapy.',
    hourly_rate: 35,
    is_verified: true,
  },
  {
    id: '2',
    full_name: 'Dr. Thandi Nkosi',
    specialties: ['PTSD', 'Child Psychology'],
    location: 'Johannesburg, South Africa',
    languages: ['English', 'Zulu'],
    bio: 'Focuses on child and adolescent mental health.',
    hourly_rate: 45,
    is_verified: true,
  },
  {
    id: '3',
    full_name: 'Dr. Wanjiku Mwangi',
    specialties: ['Anxiety', 'PTSD'],
    location: 'Nairobi, Kenya',
    languages: ['English', 'Swahili'],
    bio: 'Works with refugees and displaced communities.',
    hourly_rate: 40,
    is_verified: true,
  }
];

export default function ProviderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const specialtiesList = ['All', 'Anxiety', 'Depression', 'PTSD', 'Trauma', 'Child Psychology', 'CBT'];
  const languagesList = ['All', 'English', 'Yoruba', 'Hausa', 'Igbo', 'French', 'Swahili', 'Pidgin', 'Zulu', 'Amharic'];

  const filteredProviders = sampleProviders.filter((provider) => {
    const matchesSearch = 
      provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || provider.specialties.includes(selectedSpecialty);
    const matchesLanguage = selectedLanguage === 'All' || provider.languages.includes(selectedLanguage);

    return matchesSearch && matchesSpecialty && matchesLanguage;
  });

  const handleBookSession = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingConfirmed(false);
  };

  const confirmBooking = (date: string, time: string, reason: string) => {
    if (!selectedProvider) return;

    const newBooking = {
      id: Date.now(),
      providerName: selectedProvider.full_name,
      date,
      time,
      reason,
      status: 'Upcoming' as const
    };

    // Save to localStorage (real data)
    const existing = JSON.parse(localStorage.getItem('mySessions') || '[]');
    localStorage.setItem('mySessions', JSON.stringify([...existing, newBooking]));

    setBookingDetails(newBooking);
    setBookingConfirmed(true);
  };

  const closeModal = () => {
    setSelectedProvider(null);
    setBookingConfirmed(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Find a Provider</h1>
          <p className="text-gray-600 text-center mb-10">Connect with verified mental health professionals across Africa</p>

          {/* Filters */}
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by name, specialty or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-2xl text-gray-900"
              />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-2xl text-gray-900"
              >
                {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-2xl text-gray-900"
              >
                {languagesList.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-xl text-gray-900">{provider.full_name}</h3>
                  {provider.is_verified && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">✓ Verified</span>}
                </div>
                <p className="text-gray-500 text-sm mt-1">{provider.location}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.specialties.map((spec, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{spec}</span>
                  ))}
                </div>

                <div className="mt-4 text-sm text-gray-600 line-clamp-3">{provider.bio}</div>

                <div className="mt-6 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-gray-500">Hourly Rate</span>
                    <p className="text-2xl font-bold text-gray-900">${provider.hourly_rate}</p>
                  </div>
                  <button 
                    onClick={() => handleBookSession(provider)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedProvider && !bookingConfirmed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Book Session with {selectedProvider.full_name}
            </h2>
            <p className="text-gray-600 mb-6">{selectedProvider.location} • ${selectedProvider.hourly_rate}/hour</p>

            <BookingForm onConfirm={confirmBooking} onCancel={closeModal} />
          </div>
        </div>
      )}

      {/* Success Modal */}
      {bookingConfirmed && bookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Your session with <strong>{bookingDetails.providerName}</strong> has been scheduled.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-3 text-gray-800">
              <p><strong>Date:</strong> {bookingDetails.date}</p>
              <p><strong>Time:</strong> {bookingDetails.time}</p>
              <p><strong>Reason:</strong> {bookingDetails.reason}</p>
            </div>

            <button onClick={closeModal} className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-medium hover:bg-emerald-700">
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BookingForm({ onConfirm, onCancel }: { onConfirm: (date: string, time: string, reason: string) => void; onCancel: () => void }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && reason) {
      onConfirm(date, time, reason);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Session</label>
        <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe what you'd like to discuss..." className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-900" required />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-4 border border-gray-400 text-gray-700 rounded-2xl font-medium hover:bg-gray-100">
          Cancel
        </button>
        <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700">
          Confirm Booking
        </button>
      </div>
    </form>
  );
}