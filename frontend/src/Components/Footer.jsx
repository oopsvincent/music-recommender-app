// src/Components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="md:pb-42 pb-50 px-6 pt-6 text-center text-[13px] text-gray-400 bg-black/70 backdrop-blur-md border-t border-white/10 w-full z-40">
      <div className="space-y-2 max-w-3xl mx-auto">
        <p>
          © 2025{" "}
          <span
            className="text-white font-semibold hover:text-green-400 transition cursor-pointer"
            onClick={() => navigate("/redirect?page=the-code-breakers")}
          >
            The Code Breakers
          </span>{" "}
          — Crafted with <span className="text-red-500">♥</span> for visionaries who love music & code.
        </p>

        <p>
          Built by{" "}
          <span
            className="text-green-400 underline hover:text-green-300 cursor-pointer transition"
            onClick={() => navigate("/redirect?page=the-code-breakers")}
          >
            The Code Breakers
          </span>{" "}
          &{" "}
          <span
            className="text-blue-400 underline hover:text-blue-300 cursor-pointer transition"
            onClick={() => navigate("/credits")}
          >
            our team
          </span>{" "}
          — MIT Licensed.
        </p>

        <p className="italic text-gray-500">
          Inspired by the rhythm of sound and the elegance of software.
        </p>

        <p>
          Full team credits{" "}
          <span
            className="text-red-500 underline hover:text-red-400 cursor-pointer"
            onClick={() => navigate("/credits")}
          >
            here
          </span>
          .
        </p>

        {/* Spotify Attribution - minimal & compliant */}
        <div className="flex justify-center items-center gap-2 pt-4 opacity-60">
          <span className="text-xs">Powered by</span>
          <img
            src="/2024-spotify-full-logo/Full_Logo_White_CMYK.svg"
            alt="Spotify"
            className="h-10 object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
