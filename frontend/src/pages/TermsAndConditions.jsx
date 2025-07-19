import React from 'react';
import { ArrowLeft, Shield, Music, AlertTriangle, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = ({ onBack }) => {
    const navigate = useNavigate();
    scrollTo(0, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={onBack}
          className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-white/80" />
          <h1 className="text-white font-semibold text-lg">Terms and Conditions</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
            <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Music className="w-6 h-6 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using our music discovery web application ("GrooveEstrella: Music Recommender"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              Our App is a music discovery platform that provides personalized music recommendations based on user preferences and survey data. The service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Music recommendation engine powered by survey data and Spotify API integration</li>
              <li>Interactive chatbot for mood-based music suggestions</li>
              <li>Music discovery tools and playback features through Spotify</li>
              <li>User preference tracking and personalization stored locally</li>
              <li>Direct integration with Spotify for accurate music data and playback functionality</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">3. Spotify Integration and Third-Party Services</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Spotify API Integration
              </h3>
              <p className="text-blue-800 mb-2">
                Our App primarily uses the Spotify API to provide accurate music data, including track information, artist details, album artwork, and playback functionality.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-blue-800 text-sm">
                <li>Music data and metadata are sourced from Spotify's database</li>
                <li>Playback features require a valid Spotify account and may require Spotify Premium</li>
                <li>Your use of Spotify-related features is subject to Spotify's Terms of Service</li>
                <li>We do not control Spotify's availability or functionality</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              4. Content Disclaimer and Explicit Material
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-900 font-semibold mb-2">Important Notice About Explicit Content:</p>
              <p className="text-orange-800 mb-2">
                Our music recommendations may include explicit content as sourced from Spotify's database. We have no control over the explicit nature of the content recommended by our algorithms.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-orange-800 text-sm">
                <li><strong>Use at Your Own Discretion:</strong> Users are responsible for reviewing content appropriateness</li>
                <li><strong>Parental Guidance:</strong> Parents should supervise children's use of the App</li>
                <li><strong>Content Filtering:</strong> We recommend using Spotify's own explicit content filters if desired</li>
                <li><strong>No Liability:</strong> We are not responsible for any offensive or inappropriate content encountered</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">5. User Consent and Data Storage</h2>
            <h3 className="text-lg font-medium text-gray-800">5.1 Local Storage Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              By using our App, you explicitly consent to the storage of data on your device's local storage (localStorage). This consent is required for the App to function properly and provide personalized recommendations.
            </p>
            <h3 className="text-lg font-medium text-gray-800">5.2 Data Storage Location</h3>
            <p className="text-gray-700 leading-relaxed">
              All user data, preferences, and interaction history are stored locally on your device. We do not store personal user data on external servers or databases.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">6. User Responsibilities</h2>
            <h3 className="text-lg font-medium text-gray-800">6.1 Appropriate Use</h3>
            <p className="text-gray-700 leading-relaxed">You agree to use the App only for lawful purposes and will not:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Use the App to transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to reverse engineer, modify, or tamper with the App's functionality</li>
              <li>Use automated systems to access the App beyond normal usage patterns</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Abuse or overload the Spotify API integration</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-800">6.2 Spotify Account Responsibility</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the security and compliance of your Spotify account when using integrated features.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">7. Limitation of Liability</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">7.1 No Warranties</h3>
              <p className="text-gray-700 mb-2">The App is provided "as is" without warranties of any kind, either express or implied.</p>
              
              <h3 className="font-semibold text-gray-800 mb-2">7.2 Music Content Disclaimer</h3>
              <p className="text-gray-700 mb-2">
                We do not guarantee the accuracy, completeness, appropriateness, or suitability of music recommendations. Users access explicit or potentially offensive content at their own risk.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-2">7.3 Third-Party Service Limitations</h3>
              <p className="text-gray-700">
                We are not responsible for Spotify service interruptions, changes to their API, or any issues arising from Spotify's platform.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">8. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide continuous access to our App, but we do not guarantee uninterrupted availability. Service may be affected by Spotify API limitations, maintenance, or updates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">9. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              The App's design, functionality, and algorithms are our intellectual property. Music content and data are provided through Spotify's API and remain subject to their intellectual property rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the App after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">11. Contact Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 mb-2">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="space-y-1 text-blue-800">
                <p><strong>Email:</strong> [seinheim@gmail.com]</p>
                <p className='cursor-pointer underline' onClick={( ) => navigate("/redirect?page=the-code-breakers")}><strong>Website: </strong>the-code-breakers</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-600 italic text-center">
              By using our App, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;