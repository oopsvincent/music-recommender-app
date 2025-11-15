// src/pages/PrivacyPolicy.jsx
import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Database, Lock, Eye, Headphones, AlertCircle } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
  // Run scroll once on mount only and guard for environments without window.scrollTo
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch (e) {
      console.warn('scrollTo failed', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => typeof onBack === 'function' && onBack()}
          className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white/80" />
          <h1 className="text-white font-semibold text-lg">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This Privacy Policy describes how our music discovery web application collects, uses, and protects your information. We are committed to protecting your privacy and being transparent about our data practices, including our integration with Spotify's services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-600" />
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-gray-800">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li><strong>Music Preferences:</strong> Musical tastes, favorite genres, artists, and songs you share</li>
              <li><strong>Mood and Context Data:</strong> Information about your current mood, activities, or situations</li>
              <li><strong>Survey Responses:</strong> Responses to music preference surveys and questionnaires</li>
              <li><strong>Chat Interactions:</strong> Messages and queries you send to our music recommendation chatbot</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800">2.2 Spotify Integration Data</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Data from Spotify API
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-green-800 text-sm">
                <li>Track metadata (song titles, artists, albums, duration, popularity)</li>
                <li>Album artwork and artist images for display purposes</li>
                <li>Audio features and characteristics for recommendation matching</li>
                <li>Playlist information when relevant to recommendations</li>
                <li>Playback state and controls (when using integrated player)</li>
              </ul>
              <p className="text-green-800 text-sm mt-2">
                <strong>Note:</strong> This data is sourced from Spotify's public API and is not stored permanently on our servers.
              </p>
            </div>

            <h3 className="text-lg font-medium text-gray-800">2.3 Information We Do NOT Collect</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="list-disc pl-4 space-y-1 text-red-800 text-sm">
                <li>Personal identity information (names, email addresses, phone numbers)</li>
                <li>Your Spotify login credentials or authentication tokens</li>
                <li>Your Spotify listening history or personal playlists</li>
                <li>Location data or geographic information</li>
                <li>Social media data or contacts</li>
                <li>Payment or financial information</li>
              </ul>
            </div>
          </section>

          {/* ... rest unchanged ... */}

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 italic text-center">
              This Privacy Policy is effective as of the date listed above and applies to all users of our music discovery application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
