import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');

  if (access_token && refresh_token) {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    console.log("✅ Tokens stored from redirect!");
    navigate("/");
    return;
  }

  const code = searchParams.get('code');
  if (!code) {
    alert("No Spotify code or token. Try again!");
    navigate("/");
    return;
  }

  // Do fetch fallback here if you want
}, []);
}
