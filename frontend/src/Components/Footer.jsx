// src/Components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className=" pb-40 bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 py-3 px-6 text-center text-xs text-gray-300 z-40">
      <p>© 2025 <span className="font-semibold text-white">The CodeBreakers</span> — Crafted with <span className="text-red-400">♥</span> & elegance in the spirit of creativity and innovation.</p>
      <p className="mt-1">Built by <span className="font-semibold text-green-400">Farhan Ali Reza</span> — All rights reserved. Licensed under MIT.</p>
        <p className="mt-1">Inspired by the power of music and the beauty of code.</p>
        <p className='x'>Full credits <a className='text-red-600 underline' href='/credits'>here</a></p>
    </footer>
  );
}
