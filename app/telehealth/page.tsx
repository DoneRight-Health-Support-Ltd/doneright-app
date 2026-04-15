'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Telehealth() {
  const [isConnected, setIsConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">DO</div>
            <div>
              <p className="font-medium">Session with Dr. Adebayo Okafor</p>
              <p className="text-xs text-emerald-400">Live • 00:12</p>
            </div>
          </div>
          <button
            onClick={toggleConnection}
            className={`px-6 py-2 rounded-2xl font-medium transition ${isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isConnected ? 'End Call' : 'Start Video Call'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 bg-gray-950 relative">
          {/* Main Video Area */}
          <div className="w-full max-w-4xl bg-gray-800 rounded-3xl aspect-video flex items-center justify-center relative overflow-hidden">
            {isConnected ? (
              <>
                {/* Placeholder Video */}
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-6xl mb-6">
                    👨‍⚕️
                  </div>
                  <p className="text-white text-2xl font-medium">Dr. Adebayo Okafor</p>
                  <p className="text-emerald-400">Connected • Live</p>
                </div>

                {/* Your own video (small overlay) */}
                <div className="absolute bottom-6 right-6 bg-gray-900 rounded-2xl w-48 aspect-video flex items-center justify-center border-2 border-white/30">
                  <span className="text-white text-sm">You (Camera On)</span>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <p className="text-2xl mb-4">Ready to start video session?</p>
                <button
                  onClick={toggleConnection}
                  className="bg-emerald-600 text-white px-10 py-4 rounded-3xl text-lg font-medium hover:bg-emerald-700 transition"
                >
                  Join Video Call
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {isConnected && (
          <div className="bg-gray-800 py-4 flex items-center justify-center gap-8 text-white">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`px-6 py-3 rounded-2xl flex items-center gap-2 ${micOn ? 'bg-gray-700' : 'bg-red-500'}`}
            >
              {micOn ? '🎤 Mic On' : '🔇 Mic Off'}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`px-6 py-3 rounded-2xl flex items-center gap-2 ${cameraOn ? 'bg-gray-700' : 'bg-red-500'}`}
            >
              {cameraOn ? '📹 Camera On' : '🚫 Camera Off'}
            </button>

            <button className="px-6 py-3 bg-gray-700 rounded-2xl flex items-center gap-2">
              💬 Chat
            </button>

            <button className="px-6 py-3 bg-gray-700 rounded-2xl flex items-center gap-2">
              📝 Notes
            </button>
          </div>
        )}
      </div>
    </>
  );
}