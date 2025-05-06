// API utilities for WP options and api.ea.dev

// Get the current site's URL for the REST API
const WP_API_BASE = `${window.location.origin}/wp-json/cookiebot/v1/option`;
export const API_BASE_URL = 'https://api.ea.dev.usercentrics.cloud/v1';

export function getWpOption(key) {
  return fetch(`${WP_API_BASE}/${key}`)
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - Please authenticate again');
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => data.value);
}

export function setWpOption(key, value) {
  return fetch(`${WP_API_BASE}/${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value })
  }).then(res => {
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Unauthorized - Please authenticate again');
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
}

export function fetchEaWithToken(endpoint, token, options = {}) {
  if (!token) {
    return Promise.reject(new Error('No authentication token available'));
  }

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  }).then(res => {
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Unauthorized - Please authenticate again');
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
} 