// src/pages/NotFound.jsx
import React from 'react';

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      {/* You can add a link to your homepage or other helpful elements */}
      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}

export default NotFound;