'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="pt-28 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Mental Health Support<br />
              <span className="text-blue-600">for Africa</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto mb-12">
              Connecting you with verified therapists and counselors across Africa. 
              Culturally sensitive care, made simple and accessible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-600 text-white px-8 py-3.5 rounded-3xl font-semibold text-base hover:bg-blue-700 transition shadow-sm"
              >
                Get Started
              </Link>
              <Link 
                href="/providers"
                className="border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-3xl font-semibold text-base hover:bg-gray-50 transition"
              >
                Find a Provider
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why DoneRight?</h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6">🌍</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Africa-First</h3>
                <p className="text-gray-600">Built for our realities: local languages, cultural understanding, and accessible care.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl mb-6">🛡️</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Verified Professionals</h3>
                <p className="text-gray-600">Only licensed therapists. Your safety and trust come first.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mb-6">📱</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Easy & Private</h3>
                <p className="text-gray-600">Secure video calls and resources from your phone or computer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold mb-6">Ready to begin your healing journey?</h2>
            <p className="text-xl mb-10">Join thousands getting quality mental health support.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-10 py-4 rounded-3xl font-semibold text-lg hover:bg-gray-100 transition"
              >
                Sign Up as Client
              </Link>
              <Link 
                href="/onboarding"
                className="border border-white/50 text-white px-10 py-4 rounded-3xl font-semibold text-lg hover:bg-white/10 transition"
              >
                Join as Provider
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm">© 2026 DoneRight Africa. All rights reserved.</p>
            <p className="text-xs mt-4">Building better mental health access for our people.</p>
          </div>
        </footer>
      </div>
    </>
  );
}