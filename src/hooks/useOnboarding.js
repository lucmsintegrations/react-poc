import { useState, useCallback } from 'react';
import { useAppContext } from '../AppContext';
import { fetchEaWithToken } from '../api';
import { getOption, setOption, injectBanner } from '../cmsAdapter';
import { ONBOARDING_STATUS, OPTION_KEYS, API_ENDPOINTS, SCAN_STATUS } from '../constants';
import { getFormattedDomain, extractScanId } from '../utils';

// useOnboarding: Direct port of the onboarding/account/scan flow from account.js.old
export function useOnboarding() {
  const { authToken } = useAppContext();
  const [status, setStatus] = useState(ONBOARDING_STATUS.IDLE);
  const [error, setError] = useState(null);

  // Helper: check scan status
  const checkScanStatus = useCallback(async (scanId, token) => {
    try {
      const response = await fetchEaWithToken(`/scan/${scanId}`, token);
      const data = response;
      if (data.status === SCAN_STATUS.DONE) {
        await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.DONE);
        return;
      }
      await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.IN_PROGRESS);
    } catch (error) {
      console.error('Error checking scan status:', error);
      await setOption(OPTION_KEYS.SCAN_STATUS, SCAN_STATUS.FAILED);
    }
  }, []);

  // Helper: fetch configuration details
  const fetchConfigurationDetails = useCallback(async (configId, token) => {
    const data = await fetchEaWithToken(`/configurations/${configId}`, token);
    await setOption(OPTION_KEYS.CONFIGURATION, data);
    return data;
  }, []);

  // Main onboarding function
  const runOnboarding = useCallback(async () => {
    setStatus(ONBOARDING_STATUS.STARTING);
    setError(null);
    try {
      // 1. Check for existing CBID and user data
      const cbid = await getOption(OPTION_KEYS.CBID);
      const wasOnboarded = await getOption(OPTION_KEYS.WAS_ONBOARDED);
      const hasUserData = await getOption(OPTION_KEYS.USER_DATA);
      if ((cbid && !hasUserData && !wasOnboarded) || (!cbid && wasOnboarded)) {
        setStatus(ONBOARDING_STATUS.SKIPPED);
        return;
      }

      // 2. Fetch user data
      setStatus(ONBOARDING_STATUS.FETCHING_USER);
      const userDataArr = await fetchEaWithToken(API_ENDPOINTS.ACCOUNTS, authToken);
      const userData = userDataArr?.[0];
      if (!userData) throw new Error('No user data received');
      await setOption(OPTION_KEYS.USER_DATA, userData);

      // 3. If already onboarded and authenticated, check scan status
      if (hasUserData && cbid) {
        setStatus(ONBOARDING_STATUS.CHECKING_SCAN);
        const scanId = await getOption(OPTION_KEYS.SCAN_ID);
        if (scanId) {
          await checkScanStatus(scanId, authToken);
        }
        await fetchConfigurationDetails(cbid, authToken);
        // Inject banner if we have a CBID
        if (cbid) {
          await injectBanner(cbid);
        }
        setStatus(ONBOARDING_STATUS.DONE);
        return;
      }

      // 4. Create configuration if needed
      let configId = cbid;
      if (!cbid) {
        setStatus(ONBOARDING_STATUS.CREATING_CONFIG);
        const formattedDomain = getFormattedDomain();
        const configData = await fetchEaWithToken(API_ENDPOINTS.CONFIGURATIONS, authToken, {
          method: 'POST',
          body: JSON.stringify({
            configuration_name: window.location.hostname || 'My Site',
            data_controller: '',
            legal_framework_template: 'gdpr',
            domains: [formattedDomain]
          })
        });
        configId = configData.configuration_id || configData.id;
        if (!configId) throw new Error('No configuration ID');
        await setOption(OPTION_KEYS.CBID, configId);
        // Inject banner with new CBID
        await injectBanner(configId);
      }

      // 5. Start scan if needed
      let scanId = await getOption(OPTION_KEYS.SCAN_ID);
      if (!scanId) {
        setStatus(ONBOARDING_STATUS.STARTING_SCAN);
        const formattedDomain = getFormattedDomain();
        const scanResponse = await fetchEaWithToken(API_ENDPOINTS.SCAN, authToken, {
          method: 'POST',
          body: JSON.stringify({
            domains: [formattedDomain],
            configuration_id: configId
          })
        });
        scanId = extractScanId(scanResponse);
        if (!scanId) throw new Error('No scan ID received in response');
        await setOption(OPTION_KEYS.SCAN_ID, scanId);
      }

      // 6. Check scan status
      setStatus(ONBOARDING_STATUS.CHECKING_SCAN);
      await checkScanStatus(scanId, authToken);

      // 7. Fetch configuration details
      setStatus(ONBOARDING_STATUS.FETCHING_CONFIG);
      await fetchConfigurationDetails(configId, authToken);

      // 8. Fetch and store user data again
      setStatus(ONBOARDING_STATUS.FETCHING_USER_FINAL);
      const userDataArr2 = await fetchEaWithToken(API_ENDPOINTS.ACCOUNTS, authToken);
      const userData2 = userDataArr2?.[0];
      if (!userData2) throw new Error('No user data received');
      await setOption(OPTION_KEYS.USER_DATA, userData2);

      // 9. Mark onboarding as complete
      setStatus(ONBOARDING_STATUS.MARKING_ONBOARDED);
      await setOption(OPTION_KEYS.ONBOARDED, true);
      await setOption(OPTION_KEYS.WAS_ONBOARDED, true);
      setStatus(ONBOARDING_STATUS.DONE);
    } catch (err) {
      setError(err.message || String(err));
      setStatus(ONBOARDING_STATUS.ERROR);
    }
  }, [authToken, checkScanStatus, fetchConfigurationDetails]);

  return {
    runOnboarding,
    status,
    error
  };
} 