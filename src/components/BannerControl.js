import React, { useEffect, useState } from 'react';
import infoIcon from '../assets/img/icons/info.svg';
import linkIcon from '../assets/img/icons/link.svg';
import './BannerControl.css';
import { getOption, setOption } from '../cmsAdapter';

const BannerControl = ({ wpData, username, appPassword }) => {
  const {
    legal_framework,
    subscription_type,
    customize_banner_link,
    configure_banner_link,
    preview_link
  } = wpData;

  // Load settings from WP options
  const [bannerSettings, setBannerSettings] = useState({
    banner_enabled: false,
    auto_blocking_mode: false,
    gcm_enabled: false
  });

  useEffect(() => {
    async function loadSettings() {
      const banner_enabled = await getOption('cookiebot-banner-enabled');
      const auto_blocking_mode = await getOption('cookiebot-uc-auto-blocking-mode');
      const gcm_enabled = await getOption('cookiebot-gcm');
      setBannerSettings({
        banner_enabled: banner_enabled === '1',
        auto_blocking_mode: auto_blocking_mode === '1',
        gcm_enabled: gcm_enabled === '1'
      });
    }
    loadSettings();
  }, []);

  const handleToggle = async (setting) => {
    const newValue = !bannerSettings[setting];
    setBannerSettings(prev => ({ ...prev, [setting]: newValue }));
    // Persist to WP
    let optionKey = '';
    switch (setting) {
      case 'banner_enabled': optionKey = 'cookiebot-banner-enabled'; break;
      case 'auto_blocking_mode': optionKey = 'cookiebot-uc-auto-blocking-mode'; break;
      case 'gcm_enabled': optionKey = 'cookiebot-gcm'; break;
      default: return;
    }
    await setOption(optionKey, newValue ? '1' : '0');
  };

  return (
    <div className="gray-box-overview">
      <div className="header-section">
        <div>
          <div className="top-row">
            <a href={preview_link || '/'} target="_blank" rel="noopener noreferrer" className="dashboard-link">
              Preview
            </a>
            <span className="free-badge">{subscription_type}</span>
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
                checked={bannerSettings.banner_enabled}
                onChange={() => handleToggle('banner_enabled')}
              />
              <label htmlFor="cookiebot-banner-enabled" className="toggle-label" />
            </div>
            <div className={`label-wrapper status-badge ${bannerSettings.banner_enabled ? 'active' : 'inactive'}`} id="cookiebot-banner-badge">
              <div className="label-2">
                {bannerSettings.banner_enabled ? 'Active' : 'Inactive'}
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
              <img className="img" src={infoIcon} alt="Info" />
            </div>
          </div>
          <div className="option-controls">
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="cookiebot-uc-auto-blocking-mode"
                className="toggle-input"
                checked={bannerSettings.auto_blocking_mode}
                onChange={() => handleToggle('auto_blocking_mode')}
              />
              <label htmlFor="cookiebot-uc-auto-blocking-mode" className="toggle-label" />
            </div>
            <div className={`label-wrapper status-badge ${bannerSettings.auto_blocking_mode ? 'active' : 'inactive'}`} id="cookiebot-uc-auto-blocking-mode-badge">
              <div className="label-2">
                {bannerSettings.auto_blocking_mode ? 'Active' : 'Inactive'}
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
              <img className="img" src={infoIcon} alt="Info" />
            </div>
          </div>
          <div className="option-controls">
            <div className="toggle-switch">
              <input
                type="checkbox"
                id="cookiebot-gcm"
                className="toggle-input"
                checked={bannerSettings.gcm_enabled}
                onChange={() => handleToggle('gcm_enabled')}
              />
              <label htmlFor="cookiebot-gcm" className="toggle-label" />
            </div>
            <div className={`label-wrapper status-badge ${bannerSettings.gcm_enabled ? 'active' : 'inactive'}`} id="cookiebot-gcm-badge">
              <div className="label-2">
                {bannerSettings.gcm_enabled ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
        <div className="option-divider"></div>
        {/* Legal framework option */}
        <div className="option-group">
          <span className="option-label">Legal framework</span>
          <div className="option-controls legal-framework">
            <span className="legal-framework-badge">{legal_framework}</span>
          </div>
        </div>
      </div>
      <div className="banner-actions">
        <button className="cb-btn customize-banner-btn" onClick={() => window.open(customize_banner_link, '_blank')}>
          Customize banner
        </button>
        <a href={configure_banner_link} className="configure-link" target="_blank" rel="noopener noreferrer">
          <img className="material-icons" src={linkIcon} alt="Link" />
          How to configure your banner
        </a>
      </div>
    </div>
  );
};

export default BannerControl; 