// Scan Statuses
export const SCAN_STATUS = {
  IDLE: '',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  FAILED: 'FAILED'
};

// Onboarding Statuses
export const ONBOARDING_STATUS = {
  IDLE: 'idle',
  STARTING: 'starting',
  FETCHING_USER: 'fetching_user',
  CHECKING_SCAN: 'checking_scan',
  CREATING_CONFIG: 'creating_config',
  STARTING_SCAN: 'starting_scan',
  FETCHING_CONFIG: 'fetching_config',
  FETCHING_USER_FINAL: 'fetching_user_final',
  MARKING_ONBOARDED: 'marking_onboarded',
  DONE: 'done',
  SKIPPED: 'skipped',
  ERROR: 'error'
};

// Option Keys
export const OPTION_KEYS = {
  CBID: 'cookiebot-cbid',
  USER_DATA: 'cookiebot-user-data',
  WAS_ONBOARDED: 'cookiebot-was-onboarded',
  ONBOARDED: 'cookiebot-onboarded',
  SCAN_ID: 'cookiebot-scan-id',
  SCAN_STATUS: 'cookiebot-scan-status',
  CONFIGURATION: 'cookiebot-configuration',
  AUTH_TOKEN: 'cookiebot-auth-token',
  TRIAL_EXPIRED: 'cookiebot-trial-expired'
};

// API Endpoints
export const API_ENDPOINTS = {
  ACCOUNTS: '/accounts',
  CONFIGURATIONS: '/configurations',
  SCAN: '/scan',
  AUTH: 'https://api.ea.dev.usercentrics.cloud/v1/auth/auth0/authorize'
};

// Admin URLs
export const ADMIN_URLS = {
  SERVICE_SETTINGS: 'https://admin.usercentrics.eu/#/v3/service-settings/dps-scanner',
  SUBSCRIPTION_MANAGE: 'https://account.usercentrics.eu/subscription'
};

// Messages
export const MESSAGES = {
  SCAN: {
    FAILED: 'We encountered an issue while scanning your website. You can try initiating a scan manually via the Admin Interface.',
    IN_PROGRESS: 'We\'re scanning your website for data processing services. They should appear in 10 minutes, but it may take up to 24 hours.',
    DEFAULT: 'We\'ll scan your website for data processing services. This helps identify and manage cookies and tracking technologies on your site.'
  },
  BANNER: {
    NEW_ACCOUNT: 'Note: A new account comes with a new banner, which will replace your existing one.',
    SIMPLIFIED: 'We\'ve simplified privacy compliance for you. Save time with auto-setup, website scanning for data processing services, and consent-first blocking.',
    ACTIVATE: 'Activate your banner in seconds with easy auto-setup, smart data processing services detection, and consent-first blocking for automated privacy compliance.'
  },
  UPGRADE: {
    INTRO: 'Upgrade to unlock these premium benefits:',
    FEATURES: [
      'Match your consent banner to your brand with advanced customization options.',
      'Adapt your banner to increase opt-ins using our consent analytics data.',
      'Benefit from higher session limits and maintain privacy compliance as your traffic grows.'
    ],
    READY: 'Ready to take your consent experience to the next level?'
  }
}; 