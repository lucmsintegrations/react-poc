import React, { useEffect, useState } from 'react';
import { useAppContext } from '../AppContext';
import { fetchEaWithToken } from '../api';
import { getOption, setOption } from '../cmsAdapter';

// Helper to format domain
function getFormattedDomain() {
  const siteDomain = window.location.hostname;
  return siteDomain.startsWith('http') ? siteDomain : `https://${siteDomain}`;
}

export default function OnboardingFlow() {
  const { authToken } = useAppContext();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function runOnboarding() {
      setStatus('starting');
      setError(null);
      try {
        // 1. Check for existing CBID and user data (legacy: cookiebot_account.has_cbid, has_user_data, was_onboarded)
        const cbid = await getOption('cookiebot-cbid');
        const wasOnboarded = await getOption('cookiebot-was-onboarded');
        const hasUserData = await getOption('cookiebot-user-data');
        if ((cbid && !hasUserData && !wasOnboarded) || (!cbid && wasOnboarded)) {
          setStatus('skipped');
          return;
        }

        // 2. Fetch user data from /accounts
        setStatus('fetching_user');
        const userDataArr = await fetchEaWithToken('/accounts', authToken);
        const userData = userDataArr?.[0];
        if (!userData) throw new Error('No user data received');
        await setOption('cookiebot-user-data', userData);

        // 3. If already onboarded and authenticated, check scan status and user data
        if (hasUserData && cbid) {
          setStatus('checking_scan');
          const scanId = await getOption('cookiebot-scan-id');
          if (scanId) {
            await checkScanStatus(scanId, authToken);
          }
          await fetchConfigurationDetails(cbid, authToken);
          setStatus('done');
          return;
        }

        // 4. If no CBID, create configuration
        let configId = cbid;
        if (!cbid) {
          setStatus('creating_config');
          const formattedDomain = getFormattedDomain();
          const configData = await fetchEaWithToken('/configurations', authToken, {
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
          await setOption('cookiebot-cbid', configId);
        }

        // 5. Start scan if needed
        let scanId = await getOption('cookiebot-scan-id');
        if (!scanId) {
          setStatus('starting_scan');
          const formattedDomain = getFormattedDomain();
          const scanResponse = await fetchEaWithToken('/scan', authToken, {
            method: 'POST',
            body: JSON.stringify({
              domains: [formattedDomain],
              configuration_id: configId
            })
          });
          scanId = scanResponse?.scan?.scan_id || scanResponse?.scan_id || scanResponse?.id;
          if (!scanId) throw new Error('No scan ID received in response');
          await setOption('cookiebot-scan-id', scanId);
        }

        // 6. Check scan status
        setStatus('checking_scan');
        await checkScanStatus(scanId, authToken);

        // 7. Fetch configuration details
        setStatus('fetching_config');
        await fetchConfigurationDetails(configId, authToken);

        // 8. Fetch and store user data again
        setStatus('fetching_user_final');
        const userDataArr2 = await fetchEaWithToken('/accounts', authToken);
        const userData2 = userDataArr2?.[0];
        if (!userData2) throw new Error('No user data received');
        await setOption('cookiebot-user-data', userData2);

        // 9. Mark onboarding as complete
        setStatus('marking_onboarded');
        await setOption('cookiebot-onboarded', true);
        await setOption('cookiebot-was-onboarded', true);
        setStatus('done');
      } catch (err) {
        setError(err.message || String(err));
        setStatus('error');
      }
    }
    if (authToken) runOnboarding();
  }, [authToken]);

  // Helper: check scan status (legacy logic)
  async function checkScanStatus(scanId, token) {
    const response = await fetchEaWithToken(`/scan/${scanId}`, token);
    const data = response;
    if (data.status === 'DONE') {
      await setOption('cookiebot-scan-status', 'DONE');
      return;
    }
    await setOption('cookiebot-scan-status', 'IN_PROGRESS');
    if (!response.ok) {
      await setOption('cookiebot-scan-status', 'FAILED');
    }
  }

  // Helper: fetch configuration details (legacy logic)
  async function fetchConfigurationDetails(configId, token) {
    const data = await fetchEaWithToken(`/configurations/${configId}`, token);
    await setOption('cookiebot-configuration', data);
    return data;
  }

  return (
    <div>
      <h2>Onboarding Status: {status}</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
} 