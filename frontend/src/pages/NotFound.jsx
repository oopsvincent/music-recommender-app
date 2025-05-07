// src/pages/NotFound.jsx
import React from 'react';

function NotFound() {
  return (
    <div className='w-full h-lvh text-white text-2xl flex flex-col justify-center items-center'>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      {/* You can add a link to your homepage or other helpful elements */}
      <a href="/">Go To HomePage</a>
    </div>
  );
}

export default NotFound;