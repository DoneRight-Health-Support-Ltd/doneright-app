'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

type Session = {
  id: number;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export default function MySessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, using localStorage as temporary storage (we'll replace with real DB later)
    const savedSessions = localStorage.getItem('mySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      // Sample data for demonstration
      const sampleSessions: Session[] = [
        {
          id: 1,
          providerName: "Dr. Adebayo Okafor",
          date: "2026-04-20",
          time: "14:00",
          reason: "General anxiety and stress management",
          status: "Upcoming"
        },
        {
          id: 2,
          providerName: "Dr. Thandi Nkosi",
          date: "2026-04-15",
          time: "10:30",
          reason: "Child-related behavioral concerns",
          status: "Completed"
        }
      ];
      setSessions(sampleSessions);
      localStorage.setItem('mySessions', JSON.stringify(sampleSessions));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading your sessions...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Sessions</h1>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <p className="text-gray-500">You have no sessions yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-3xl shadow-sm p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900">{session.providerName}</h3>
                      <p className="text-gray-600 mt-1">
                        {session.date} at {session.time}
                      </p>
                      <p className="text-sm text-gray-500 mt-3">{session.reason}</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                      <span className={`px-6 py-2 rounded-2xl text-sm font-medium ${
                        session.status === 'Upcoming' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}