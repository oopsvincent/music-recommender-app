// src/Components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {

    const navigate = useNavigate();

  return (
    <footer className=" pb-40 bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm border-t border-white/10 py-3 px-6 text-center text-xs text-gray-300 z-40 tracking-wide">
      <p>© 2025 <span className="font-semibold text-white cursor-pointer"><span onClick={() => {
        navigate("/redirect?page=the-code-breakers");
      }}>The Code Breakers</span></span> — Crafted with <span className="text-red-400">♥</span> & elegance in the spirit of creativity and innovation.</p>
      <p className="mt-1">Built by <span className="font-semibold text-green-400 underline cursor-pointer"><span onClick={() => {
        navigate("/redirect?page=the-code-breakers");
      }}>The Code Breakers</span></span> <span>& <span className="cursor-pointer" onClick={() => {
        navigate("/credits");
      }}>team</span></span> — All rights reserved. Licensed under MIT.</p>
        <p className="mt-1">Inspired by the power of music and the beauty of code.</p>
        <p className='x'>Full team credits <span className='text-red-600 underline cursor-pointer' onClick={() => {
            navigate("/credits");
        }}>here</span></p>
    </footer>
  );
}
