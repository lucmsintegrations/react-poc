/**
 * Formats the current domain for API requests
 * @returns {string} Formatted domain URL
 */
export function getFormattedDomain() {
  const siteDomain = window.location.hostname;
  return siteDomain.startsWith('http') ? siteDomain : `https://${siteDomain}`;
}

/**
 * Gets the callback domain for OAuth
 * @returns {string} Callback domain URL
 */
export function getCallbackDomain() {
  return window.location.origin + '/wp-admin/admin.php?page=cookiebot';
}

/**
 * Formats a date string to locale format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Extracts scan ID from various response formats
 * @param {Object} response - API response object
 * @returns {string|null} Scan ID or null
 */
export function extractScanId(response) {
  return response?.scan?.scan_id || response?.scan_id || response?.id || null;
}

/**
 * Checks if a value is truthy
 * @param {*} value - Value to check
 * @returns {boolean} True if value is truthy
 */
export function isTruthy(value) {
  return !!value;
}

/**
 * Safely accesses nested object properties
 * @param {Object} obj - Object to access
 * @param {string} path - Dot-notation path
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path or default value
 */
export function getNestedValue(obj, path, defaultValue = null) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] ? acc[part] : defaultValue), obj);
} 