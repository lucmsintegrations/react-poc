import { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { fetchEaWithToken } from './api';
import { getOption, setOption } from './cmsAdapter';

export function useWpOption(key, defaultValue = null) {
    const [value, setValue] = useState(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useAppContext();

    useEffect(() => {
        let mounted = true;
        let retries = 0;
        const maxRetries = 3;

        const loadValue = async () => {
            try {
                const result = await getOption(key);
                if (mounted) {
                    setValue(result);
                    setLoading(false);
                }
            } catch (err) {
                if (retries < maxRetries) {
                    retries++;
                    // Exponential backoff: 1s, 2s, 4s
                    setTimeout(loadValue, Math.pow(2, retries - 1) * 1000);
                } else if (mounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        if (authToken) {
            loadValue();
        } else {
            setLoading(false);
        }

        return () => {
            mounted = false;
        };
    }, [key, authToken]);

    return { value, loading, error };
}

export function useUserData() {
    const { value: userData, loading, error } = useWpOption('cookiebot-user-data', {});
    return { userData, loading, error };
}

export function useScanStatus() {
    const { value: scanStatus, loading, error } = useWpOption('cookiebot-scan-status', '');
    return { scanStatus, loading, error };
}

export function useEaApi(endpoint, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authToken } = useAppContext();

    useEffect(() => {
        let mounted = true;
        let retries = 0;
        const maxRetries = 3;

        const fetchData = async () => {
            try {
                const result = await fetchEaWithToken(endpoint, authToken, options);
                if (mounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (err) {
                if (retries < maxRetries) {
                    retries++;
                    // Exponential backoff: 1s, 2s, 4s
                    setTimeout(fetchData, Math.pow(2, retries - 1) * 1000);
                } else if (mounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        if (authToken) {
            fetchData();
        } else {
            setLoading(false);
            setError(new Error('No authentication token available'));
        }

        return () => {
            mounted = false;
        };
    }, [endpoint, options, authToken]);

    return { data, loading, error };
} 