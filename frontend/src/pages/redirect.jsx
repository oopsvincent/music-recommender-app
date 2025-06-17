// src/pages/Redirect.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirectInfo, setRedirectInfo] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page");

    if (!page) {
      navigate("/404");
      return;
    }

    const redirectMap = {
      "the-code-breakers": {
        url: "https://the-code-breakers.vercel.app",
        newTab: true,
        name: "The Code Breakers Website",
      },
      "discord": {
        url: "https://discord.gg/your-invite",
        newTab: true,
        name: "OopsVincent Discord",
      },
      "portfolio": {
        url: "https://oopsvincent.dev",
        newTab: false,
        name: "Vincent’s Portfolio",
      },
      // Add more mappings here
    };

    const redirectData = redirectMap[page];

    if (redirectData) {
      setRedirectInfo({ ...redirectData, key: page });

      // Log analytics
      console.log(`[Analytics] User is being redirected to "${redirectData.name}" (${redirectData.url}) from "${window.location.href}"`);
      
      // Delay the redirect
      const timeout = setTimeout(() => {
        if (redirectData.newTab) {
          window.open(redirectData.url, "_blank", "noopener noreferrer");
        } else {
          window.location.href = redirectData.url;
        }
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      navigate("/404");
    }
  }, [location, navigate]);

  if (!redirectInfo) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">You're being redirected</h1>
      <p className="text-gray-300 mb-2 ">
        We're taking you to: <span className="text-white font-bold underline my-6 tracking-wide">{redirectInfo.name}</span>
      </p>
      {/* <p className="text-sm text-red-400 mb-6">
        ⚠️ You're about to leave this site. Please make sure you trust the destination.
      </p> */}
      <p className="text-xs text-gray-500">If you're not redirected within a few seconds, <a href={redirectInfo.url} target={redirectInfo.newTab ? "_blank" : "_self"} rel="noopener noreferrer" className="underline text-blue-400">click here</a>.</p>
    </div>
  );
}
