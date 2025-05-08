import { useAuth } from '../hooks/AuthContext';

const SpotifyCallbackHandler = () => {
    const { setAuthTokens } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
            setAuthTokens({ accessToken, refreshToken });
        }
    }, []);

    return <Navigate to="/account" />;
};
