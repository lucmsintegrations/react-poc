import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useAppContext } from './AppContext';
import Dashboard from './components/Dashboard';
import OAuthCallback from './components/OAuthCallback';
import Settings from './components/Settings';
import './App.css';
import './dashboard.css';
import { getOption } from './cmsAdapter';

console.log('App.js loaded');

const AppContent = () => {
  const { authToken, setAuthToken } = useAppContext();

  useEffect(() => {
    async function loadToken() {
      if (!authToken) {
        const token = await getOption('cookiebot-auth-token');
        if (token) {
          setAuthToken(token);
        }
      }
    }
    loadToken();
  }, [authToken, setAuthToken]);

  const wpData = window.cookiebot_dashboard || {};
  const accountData = window.cookiebot_dashboard?.account_data || {};

  // For demo: replace with your own credential management
  const username = 'your-wp-username';
  const appPassword = 'your-app-password';

  console.log('WordPress data:', wpData);
  console.log('Account data:', accountData);
  
  return (
    <Router>
      <nav style={{ padding: 16, background: '#f5f5f5' }}>
        <Link to="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  try {
    return (
      <AppProvider>
        <AppContent />
      </AppProvider>
    );
  } catch (e) {
    console.error('App.js render error:', e);
    return <div style={{ color: 'red' }}>App.js render error: {e.toString()}</div>;
  }
};

export default App; 