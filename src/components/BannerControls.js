import React from 'react';
import './BannerControl.css';

const BannerControls = ({ settings, subscription = 'Free', onToggleBanner, onToggleAutoBlocking, onToggleGCM }) => {
  const legalFramework = settings.legalFramework || 'GDPR, ePrivacy';

  return (
    <div className="gray-box-overview">
      <div className="header-section">
        <div>
          <div className="top-row">
            <a href="/" target="_blank" className="dashboard-link">Preview</a>
            <span className="free-badge">{subscription}</span>
          </div>
          <h1>Banner control</h1>
          <p className="subtitle">Choose and control your banner settings and display options.</p>
        </div>
      </div>

      <div className="banner-options">
        {/* Show banner on site option */}
        <div className="option-group">
          <span className="option-label">Show banner on site</span>
          <div className="option-controls">
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="cookiebot-banner-enabled" 
                className="toggle-input" 
                checked={settings.bannerEnabled}
                onChange={() => onToggleBanner(!settings.bannerEnabled)}
              />
              <label htmlFor="cookiebot-banner-enabled" className="toggle-label"></label>
            </div>
            <div 
              id="cookiebot-banner-badge" 
              className={`label-wrapper status-badge ${settings.bannerEnabled ? 'active' : 'inactive'}`}
            >
              <div className="label-2">
                {settings.bannerEnabled ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        <div className="option-divider"></div>

        {/* Auto blocking mode option */}
        <div className="option-group">
          <div className="option-label-wrapper">
            <span className="option-label">Auto blocking mode</span>
            <div className="tooltip">
              <span className="tooltiptext">When active, automatically blocks data-processing services from loading without user consent, without requiring manual tagging of your scripts. Uses your scan results to prevent data collection without consent.</span>
              <img className="img" src={`${process.env.PUBLIC_URL}/assets/img/icons/info.svg`} alt="Info" />
            </div>
          </div>
          <div className="option-controls">
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="cookiebot-uc-auto-blocking-mode" 
                className="toggle-input" 
                checked={settings.autoBlockingMode}
                onChange={() => onToggleAutoBlocking(!settings.autoBlockingMode)}
              />
              <label htmlFor="cookiebot-uc-auto-blocking-mode" className="toggle-label"></label>
            </div>
            <div 
              id="cookiebot-uc-auto-blocking-mode-badge" 
              className={`label-wrapper status-badge ${settings.autoBlockingMode ? 'active' : 'inactive'}`}
            >
              <div className="label-2">
                {settings.autoBlockingMode ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        <div className="option-divider"></div>

        {/* Google Consent Mode option */}
        <div className="option-group">
          <div className="option-label-wrapper">
            <span className="option-label">Google Consent Mode</span>
            <div className="tooltip">
              <span className="tooltiptext">Enable Google Consent Mode to continue running remarketing campaigns and tracking conversions in Google Ads and Google Analytics. Required if you have visitors from the European Economic Area (EEA).</span>
              <img className="img" src={`${process.env.PUBLIC_URL}/assets/img/icons/info.svg`} alt="Info" />
            </div>
          </div>
          <div className="option-controls">
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="cookiebot-gcm" 
                className="toggle-input" 
                checked={settings.gcmEnabled}
                onChange={() => onToggleGCM(!settings.gcmEnabled)}
              />
              <label htmlFor="cookiebot-gcm" className="toggle-label"></label>
            </div>
            <div 
              id="cookiebot-gcm-badge" 
              className={`label-wrapper status-badge ${settings.gcmEnabled ? 'active' : 'inactive'}`}
            >
              <div className="label-2">
                {settings.gcmEnabled ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        <div className="option-divider"></div>

        {/* Legal framework option */}
        <div className="option-group">
          <span className="option-label">Legal framework</span>
          <div className="option-controls legal-framework">
            <span className="legal-framework-badge">{legalFramework}</span>
          </div>
        </div>
      </div>

      <div className="banner-actions">
        <button 
          className="cb-btn customize-banner-btn" 
          onClick={() => window.open('https://admin.usercentrics.eu/#/v3/appearance', '_blank')}
        >
          Customize banner
        </button>
        <a 
          href="https://support.cookiebot.com/hc/en-us/articles/360003784194-How-do-I-configure-the-Cookiebot-banner-" 
          className="configure-link" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="material-icons" src={`${process.env.PUBLIC_URL}/assets/img/icons/link.svg`} alt="Link" />
          How to configure your banner
        </a>
      </div>
    </div>
  );
};

export default BannerControls; 