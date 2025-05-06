import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { useAccount } from '../hooks/useAccount';
import { API_BASE_URL } from '../api';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuthToken, authToken } = useAppContext();
    const { initializeAccount } = useAccount();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingCode, setPendingCode] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            // Get code from URL
            const params = new URLSearchParams(location.search);
            const code = params.get('uc_api_code');
            console.log('OAuth code source:', 'query', code);

            if (!code) {
                setError('No authorization code found');
                setIsLoading(false);
                return;
            }

            // sessionStorage guard
            const codeKey = `cb_oauth_exchanged_${code}`;
            if (sessionStorage.getItem(codeKey)) {
                console.log('OAuth code already exchanged in this session. Skipping.');
                setIsLoading(false);
                return;
            }
            sessionStorage.setItem(codeKey, '1');

            try {
                // Exchange code for token
                console.log('Exchanging code for token with payload:', code);
                const response = await fetch(`${API_BASE_URL}/auth/auth0/exchange?code=${encodeURIComponent(code)}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log('Exchange response:', errorData);
                    throw new Error(errorData.message || 'Token exchange failed');
                }

                const data = await response.json();
                console.log('Exchange response:', data);

                // Store the token in React context (and sessionStorage via setAuthToken)
                setAuthToken(data.token);
                setPendingCode(code); // Save code for later

            } catch (error) {
                console.error('OAuth callback error:', error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        handleCallback();
    }, [location, setAuthToken]);

    useEffect(() => {
        // Only call initializeAccount when both authToken and pendingCode are set
        if (authToken && pendingCode) {
            (async () => {
                try {
                    await initializeAccount(pendingCode);
                    // Clean up URL and redirect
                    const cleanUrl = window.location.href.split('?')[0];
                    console.log('Cleaned up URL:', cleanUrl);
                    navigate(cleanUrl);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
            })();
            setPendingCode(null);
        }
    }, [authToken, pendingCode, initializeAccount, navigate]);

    if (isLoading) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <h2>Creating your account</h2>
                    <p>This should only take about a minute. Keep this window open while we set things up.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <h2>Authentication Failed</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')}>Return to Dashboard</button>
            </div>
        );
    }

    return null;
} 