import { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { fetchEaWithToken } from '../api';
import { getOption, setOption, injectBanner } from '../cmsAdapter';
import { OPTION_KEYS, API_ENDPOINTS, SCAN_STATUS } from '../constants';
import { getFormattedDomain, extractScanId } from '../utils';

export function useAccount() {
    const { authToken } = useAppContext();
    const [userData, setUserData] = useState(null);
    const [scanStatus, setScanStatus] = useState(SCAN_STATUS.IDLE);
    const [scanId, setScanId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch user data
    const fetchUserData = useCallback(async () => {
        try {
            const data = await fetchEaWithToken(API_ENDPOINTS.ACCOUNTS, authToken);
            const userData = data?.[0];
            if (userData) {
                setUserData(userData);
                await setOption(OPTION_KEYS.USER_DATA, userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.message || String(error));
        }
    }, [authToken]);

    // Start scan
    const startScan = useCallback(async () => {
        try {
            setScanStatus(SCAN_STATUS.IN_PROGRESS);
            const cbid = await getOption(OPTION_KEYS.CBID);
            if (!cbid) throw new Error('No CBID found');

            const formattedDomain = getFormattedDomain();
            const response = await fetchEaWithToken(API_ENDPOINTS.SCAN, authToken, {
                method: 'POST',
                body: JSON.stringify({
                    domains: [formattedDomain],
                    configuration_id: cbid
                })
            });

            const newScanId = extractScanId(response);
            if (!newScanId) throw new Error('No scan ID received in response');

            setScanId(newScanId);
            await setOption(OPTION_KEYS.SCAN_ID, newScanId);
            await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.IN_PROGRESS);
        } catch (error) {
            console.error('Error starting scan:', error);
            setError(error.message || String(error));
            setScanStatus(SCAN_STATUS.FAILED);
            await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.FAILED);
        }
    }, [authToken]);

    // Check scan status
    const checkScanStatus = useCallback(async () => {
        if (!scanId) return;

        try {
            const response = await fetchEaWithToken(`/scan/${scanId}`, authToken);
            const data = response;

            if (data.status === SCAN_STATUS.DONE) {
                setScanStatus(SCAN_STATUS.DONE);
                await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.DONE);
            } else {
                setScanStatus(SCAN_STATUS.IN_PROGRESS);
                await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.IN_PROGRESS);
            }
        } catch (error) {
            console.error('Error checking scan status:', error);
            setError(error.message || String(error));
            setScanStatus(SCAN_STATUS.FAILED);
            await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.FAILED);
        }
    }, [scanId, authToken]);

    // Initialize
    useEffect(() => {
        const init = async () => {
            const storedScanId = await getOption(OPTION_KEYS.SCAN_ID);
            const storedScanStatus = await getOption(OPTION_KEYS.SCAN_STATUS);
            const storedUserData = await getOption(OPTION_KEYS.USER_DATA);

            if (storedScanId) {
                setScanId(storedScanId);
            }
            if (storedScanStatus) {
                setScanStatus(storedScanStatus);
            }
            if (storedUserData) {
                setUserData(storedUserData);
            }

            // If we have a scan in progress, start checking its status
            if (storedScanId && storedScanStatus === SCAN_STATUS.IN_PROGRESS) {
                const interval = setInterval(checkScanStatus, 5000);
                return () => clearInterval(interval);
            }
        };

        init();
    }, [checkScanStatus]);

    // Inject banner if we have a CBID
    useEffect(() => {
        const injectBannerIfNeeded = async () => {
            const cbid = await getOption(OPTION_KEYS.CBID);
            if (cbid) {
                await injectBanner(cbid);
            }
        };
        injectBannerIfNeeded();
    }, []);

    // Add getAccountState for Dashboard compatibility
    const getAccountState = async () => {
      return {
        userData,
        scanStatus,
        scanId,
        error
      };
    };

    const returnObj = {
      userData,
      scanStatus,
      scanId,
      error,
      fetchUserData,
      startScan,
      checkScanStatus,
      getAccountState
    };
    console.log('useAccount return:', returnObj);
    return returnObj;
} 