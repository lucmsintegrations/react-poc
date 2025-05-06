import { storage } from '@wix/storage';

class WixAdapter {
  constructor() {
    this.isWix = true;
    this.storage = storage;
  }

  // Get options from Wix storage
  async getOptions() {
    try {
      const options = await this.storage.getItem('cookiebot-options');
      return options || {};
    } catch (error) {
      console.error('Error getting options:', error);
      return {};
    }
  }

  // Save options to Wix storage
  async saveOptions(options) {
    try {
      await this.storage.setItem('cookiebot-options', options);
      return true;
    } catch (error) {
      console.error('Error saving options:', error);
      return false;
    }
  }

  // Inject banner script into the page
  injectBanner(cbid) {
    if (!cbid) return;
    
    const script = document.createElement('script');
    script.id = 'usercentrics-cmp';
    script.setAttribute('data-sandbox', '1');
    script.setAttribute('data-settings-id', cbid);
    script.setAttribute('data-usercentrics', 'Usercentrics Consent Management Platform');
    script.src = 'https://web.cmp.usercentrics-sandbox.eu/ui/loader.js';
    script.async = true;
    
    document.head.appendChild(script);
  }

  // Check if we're in admin/editor
  isAdmin() {
    return window.wixEditor?.isEditor;
  }

  // Get current environment
  getEnvironment() {
    return {
      isWix: true,
      isAdmin: this.isAdmin(),
      platform: 'wix'
    };
  }
}

export default new WixAdapter(); 