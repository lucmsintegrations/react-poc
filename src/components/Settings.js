import React, { useState } from 'react';
import { useAccount } from '../hooks/useAccount';

const Settings = () => {
  const { fetchAndStoreUserData, isLoading, error } = useAccount();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleFetchUserData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await fetchAndStoreUserData();
      setUserData(data);
    } catch (e) {
      setErr(e.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <button onClick={handleFetchUserData} disabled={loading || isLoading}>
        {loading || isLoading ? 'Refreshing...' : 'Refresh User Data'}
      </button>
      {err && <div className="error-message">{err}</div>}
      {userData && (
        <pre style={{ marginTop: 20, background: '#f5f5f5', padding: 16 }}>
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Settings; 