/**
 * CMS Adapter Interface
 * This defines the contract that all CMS implementations must follow
 */

// Default implementation that uses localStorage (for non-WP CMSs)
const defaultAdapter = {
  getOption: async (key) => {
    return localStorage.getItem(key);
  },
  setOption: async (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  injectBanner: async (cbid) => {
    // Default banner injection script
    const script = document.createElement('script');
    script.id = 'CookiebotDeclaration';
    script.src = `https://consent.cookiebot.com/${cbid}/cd.js`;
    script.async = true;
    document.head.appendChild(script);
  },
  getCallbackUrl: () => {
    // Default callback URL for OAuth
    return `${window.location.origin}/callback`;
  },
  getAdminUrl: () => {
    // Default admin URL
    return `${window.location.origin}/admin`;
  }
};

// WordPress specific implementation
const wpAdapter = {
  getOption: async (key) => {
    const nonce = window.wpApiSettings?.nonce;
    if (!nonce) {
      console.warn('wpApiSettings.nonce is missing! REST API calls will fail.');
    }
    const endpoint = `/wp-json/cookiebot/v1/option/${encodeURIComponent(key)}`;
    console.log('GET', endpoint, 'nonce:', nonce);
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'X-WP-Nonce': nonce || '',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error fetching WordPress option:', error);
      return null;
    }
  },
  setOption: async (key, value) => {
    const nonce = window.wpApiSettings?.nonce;
    if (!nonce) {
      console.warn('wpApiSettings.nonce is missing! REST API calls will fail.');
    }
    const endpoint = `/wp-json/cookiebot/v1/option/${encodeURIComponent(key)}`;
    console.log('POST', endpoint, 'nonce:', nonce, 'value:', value);
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': nonce || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
    } catch (error) {
      console.error('Error setting WordPress option:', error);
    }
  },
  injectBanner: async (cbid) => {
    // Get settings from window or fetch from REST if needed
    const settings = window.cookiebot_dashboard || {};
    if (!cbid || settings.trial_expired || settings.banner_enabled !== '1') return;

    // Remove any existing banner scripts to avoid duplicates
    document.querySelectorAll('#usercentrics-cmp, #CookiebotDeclaration, script[src*="usercentrics"], script[src*="cookiebot"]').forEach(s => s.remove());

    // IAB/TCF stub
    if (settings.iab_enabled) {
      const tcfScript = document.createElement('script');
      tcfScript.src = 'https://web.cmp.usercentrics-sandbox.eu/tcf/stub.js';
      tcfScript.setAttribute('data-sandbox', '1');
      document.head.appendChild(tcfScript);
    }

    // Autoblocker
    let blockingMode = settings.blocking_mode ?? '1';
    let blockingModeCookiebot = settings.blocking_mode_cookiebot ?? 'auto';
    if (blockingMode === '0' || blockingModeCookiebot === 'manual') {
      blockingMode = '0';
    }
    if (blockingMode === '1') {
      const autoblockerScript = document.createElement('script');
      autoblockerScript.src = 'https://web.cmp.usercentrics-sandbox.eu/modules/autoblocker.js';
      autoblockerScript.setAttribute('data-sandbox', '1');
      document.head.appendChild(autoblockerScript);
    }

    // Main banner script
    const bannerScript = document.createElement('script');
    bannerScript.id = 'usercentrics-cmp';
    bannerScript.setAttribute('data-sandbox', '1');
    bannerScript.setAttribute('data-settings-id', cbid);
    bannerScript.setAttribute('data-usercentrics', 'Usercentrics Consent Management Platform');
    bannerScript.src = 'https://web.cmp.usercentrics-sandbox.eu/ui/loader.js';
    bannerScript.async = true;
    document.head.appendChild(bannerScript);
  },
  getCallbackUrl: () => {
    return `${window.location.origin}/wp-admin/admin.php?page=cookiebot`;
  },
  getAdminUrl: () => {
    return `${window.location.origin}/wp-admin/admin.php?page=cookiebot`;
  }
};

// Shopify specific implementation
const shopifyAdapter = {
  getOption: async (key) => {
    // Shopify would use their own storage mechanism
    return localStorage.getItem(key);
  },
  setOption: async (key, value) => {
    // Shopify would use their own storage mechanism
    localStorage.setItem(key, JSON.stringify(value));
  },
  injectBanner: async (cbid) => {
    // Shopify banner injection would go through their app proxy
    const script = document.createElement('script');
    script.id = 'CookiebotDeclaration';
    script.src = `https://consent.cookiebot.com/${cbid}/cd.js`;
    script.async = true;
    document.head.appendChild(script);
  },
  getCallbackUrl: () => {
    return `${window.location.origin}/apps/cookiebot/callback`;
  },
  getAdminUrl: () => {
    return `${window.location.origin}/admin/apps/cookiebot`;
  }
};

// Wix specific implementation
const wixAdapter = {
  getOption: async (key) => {
    // Wix would use their own storage mechanism
    return localStorage.getItem(key);
  },
  setOption: async (key, value) => {
    // Wix would use their own storage mechanism
    localStorage.setItem(key, JSON.stringify(value));
  },
  injectBanner: async (cbid) => {
    // Wix banner injection would use their widget system
    const script = document.createElement('script');
    script.id = 'CookiebotDeclaration';
    script.src = `https://consent.cookiebot.com/${cbid}/cd.js`;
    script.async = true;
    document.head.appendChild(script);
  },
  getCallbackUrl: () => {
    return `${window.location.origin}/cookiebot/callback`;
  },
  getAdminUrl: () => {
    return `${window.location.origin}/cookiebot/admin`;
  }
};

function getCurrentAdapter() {
  if (window.COOKIEBOT_ENV?.isWordPress) {
    return wpAdapter;
  }
  if (window.Shopify?.shop) {
    return shopifyAdapter;
  }
  if (window.wix) {
    return wixAdapter;
  }
  return defaultAdapter;
}

export const getOption = (...args) => getCurrentAdapter().getOption(...args);
export const setOption = (...args) => getCurrentAdapter().setOption(...args);
export const injectBanner = (...args) => getCurrentAdapter().injectBanner(...args);
export const getCallbackUrl = (...args) => getCurrentAdapter().getCallbackUrl(...args);
export const getAdminUrl = (...args) => getCurrentAdapter().getAdminUrl(...args); 