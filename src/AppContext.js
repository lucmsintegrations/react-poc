import React, { createContext, useContext, useState, useEffect } from 'react';

const TOKEN_KEY = 'cb_auth_token';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [authToken, setAuthTokenState] = useState(null);
  const [userData, setUserData] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [userDataError, setUserDataError] = useState(null);
  const [scanStatusLoading, setScanStatusLoading] = useState(false);
  const [scanStatusError, setScanStatusError] = useState(null);

  useEffect(() => {
    // On mount, restore token from sessionStorage if present
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      setAuthTokenState(stored);
    }
  }, []);

  const setAuthToken = (token) => {
    setAuthTokenState(token);
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  };

  const value = {
    authToken,
    setAuthToken,
    userData,
    setUserData,
    scanStatus,
    setScanStatus,
    userDataLoading,
    setUserDataLoading,
    userDataError,
    setUserDataError,
    scanStatusLoading,
    setScanStatusLoading,
    scanStatusError,
    setScanStatusError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 