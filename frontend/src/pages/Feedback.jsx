import React from 'react';

const FeedbackPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">We Value Your Feedback</h1>
      <p className="text-gray-600 mb-4 max-w-2xl text-center">
        Please take a moment to share your experience and thoughts about our Harmony music recommender system.
        Your feedback helps us improve and serve you better.
      </p>
      <div className="w-full max-w-4xl shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfZsJ9qZs5qNXrJylrSvm4pq0dxWegQyP7-Ucodm2u_6Qo-1A/viewform?embedded=true"
          width="100%"
          height="1567"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Feedback Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default FeedbackPage;