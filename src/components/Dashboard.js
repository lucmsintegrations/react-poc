import React, { useState, useEffect } from 'react';
import BannerControl from './BannerControl';
import SetupSteps from './SetupSteps';
import TopBanners from './TopBanners';
import '../styles/Dashboard.css';
import { useAppContext } from '../AppContext';
import { useWpOption } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import { useOnboarding } from '../hooks/useOnboarding';

const API_BASE_URL = 'https://api.ea.dev.usercentrics.cloud/v1';

console.log('Dashboard.js loaded');

const Dashboard = () => {
  const navigate = useNavigate();
  const [bannerLiveDismissed, setBannerLiveDismissed] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { authToken } = useAppContext();
  const { getAccountState, isLoading, error } = useAccount();
  const [accountState, setAccountState] = useState(null);
  const [checking, setChecking] = useState(true);

  // Directly read WP options for config and user data
  const { value: cbid, loading: cbidLoading } = useWpOption('cookiebot-cbid');
  const { value: userData, loading: userDataLoading } = useWpOption('cookiebot-user-data');
  const { value: scanStatus, loading: scanStatusLoading } = useWpOption('cookiebot-scan-status');

  // Onboarding hook
  const { runOnboarding, status: onboardingStatus } = useOnboarding();
  const onboardingStarted = onboardingStatus && onboardingStatus !== 'idle' && onboardingStatus !== 'done' && onboardingStatus !== 'skipped';

  // Safely access WordPress data
  const wpData = window.cookiebot_dashboard || window.wp_data || {};
  console.log('wpData:', wpData);

  useEffect(() => {
    async function checkState() {
      setChecking(true);
      try {
        if (authToken) {
          const state = await getAccountState();
          setAccountState(state);
        } else {
          setAccountState(null);
        }
      } catch (e) {
        setAuthError(e.message || 'Failed to load account state');
      } finally {
        setChecking(false);
      }
    }
    checkState();
  }, [authToken]);

  useEffect(() => {
    // If we have an auth code in the URL, redirect to callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('uc_api_code');
    if (code) {
      navigate('/oauth/callback?' + window.location.search);
    }
  }, [navigate]);

  if (checking || isLoading || cbidLoading || userDataLoading || scanStatusLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  if (authError || error) {
    console.error('Dashboard error:', authError, error);
    return (
      <div className="error-message">
        <h2>Dashboard Error</h2>
        <pre style={{ color: 'red' }}>{JSON.stringify(authError || error, null, 2)}</pre>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  // Always show the dashboard wrapper and steps
  return (
    <div className="cb-body">
      <div className="banner-container">
        <TopBanners 
          wpData={userData || {}}
          bannerLiveDismissed={bannerLiveDismissed}
          setBannerLiveDismissed={setBannerLiveDismissed}
        />
      </div>
      <div className="cb-wrapper">
        <SetupSteps
          cbid={cbid}
          user_data={userData}
          scan_status={scanStatus}
          subscription_type={userData?.subscriptions?.active?.price_plan}
          upgraded={userData?.subscriptions?.active?.subscription_status === 'active'}
          onboardingStarted={onboardingStarted}
          onboardingStatus={onboardingStatus}
          onGetStarted={runOnboarding}
        />
        {userData && userData.account_id && <BannerControl wpData={userData} />}
        {/* Fallback for settings/help if no userData */}
        {!userData && (
          <div>
            <div className="cb-general__info__text">
              <span className="note-text">Need to manage an existing Cookiebot or Usercentrics account?</span>
              <a href="/wp-admin/admin.php?page=cookiebot" className="note-link">
                <span>Go to Settings</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 