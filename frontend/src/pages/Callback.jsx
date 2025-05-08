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
      navigate('/account');  // ✅ Send user to dashboard (or wherever)
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      alert("No Spotify code or token. Try again!");
      navigate("/");
      return;
    }

    // Optional: Do fetch fallback here if using "code" grant
  }, [searchParams, navigate]);

  return <div>Please Wait</div>;  // Because this component is just a processor
}
