'use client';

import Navbar from '../components/Navbar';
import { useState } from 'react';

type Notification = {
  id: number;
  type: 'session' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'session',
      title: 'Upcoming Session',
      message: 'Your session with Dr. Adebayo Okafor is tomorrow at 14:00',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'Dr. Thandi Nkosi sent you a message',
      time: 'Yesterday',
      read: true
    },
    {
      id: 3,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile changes have been saved successfully',
      time: '3 days ago',
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`bg-white rounded-3xl p-6 flex gap-4 ${!notif.read ? 'border-l-4 border-blue-600' : ''}`}
              >
                <div className="mt-1">
                  {notif.type === 'session' && <span className="text-2xl">📅</span>}
                  {notif.type === 'message' && <span className="text-2xl">💬</span>}
                  {notif.type === 'system' && <span className="text-2xl">ℹ️</span>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}