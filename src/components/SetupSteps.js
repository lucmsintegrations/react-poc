import React from 'react';
import checkMarkIcon from '../assets/img/icons/check-mark.svg';
import infoIcon from '../assets/img/icons/info.svg';
import banner1 from '../assets/img/banner-getting-started1.png';
import banner2 from '../assets/img/banner-getting-started2.png';
import bannerArrow from '../assets/img/banner-arrow.png';
import { SCAN_STATUS, API_ENDPOINTS, ADMIN_URLS, MESSAGES } from '../constants';
import { getCallbackDomain, formatDate, getNestedValue } from '../utils';

const SetupSteps = (props = {}) => {
  const {
    cbid = null,
    user_data = null,
    scan_status = '',
    subscription_type = '',
    upgraded = false,
    onboardingStarted = false,
    onboardingStatus = '',
    onGetStarted = undefined
  } = props;

  const renderScanStatus = () => {
    switch (scan_status) {
      case SCAN_STATUS.IN_PROGRESS:
        return (
          <span className="in-progress-status">
            <img src={require('../assets/img/icons/clock-icon.svg').default} alt="Clock Icon" />
            In Progress
          </span>
        );
      case SCAN_STATUS.DONE:
        return <span className="done-status">Done!</span>;
      case SCAN_STATUS.FAILED:
        return <span className="failed-status">Failed</span>;
      default:
        return null;
    }
  };

  const renderScanMessage = () => {
    const serviceSettingsUrl = `${ADMIN_URLS.SERVICE_SETTINGS}?settingsId=${cbid}`;
    
    switch (scan_status) {
      case SCAN_STATUS.FAILED:
        return (
          <>
            {MESSAGES.SCAN.FAILED}{' '}
            <a href={serviceSettingsUrl} target="_blank" rel="noopener noreferrer">
              Admin Interface
            </a>.
          </>
        );
      case SCAN_STATUS.IN_PROGRESS:
        return (
          <>
            {MESSAGES.SCAN.IN_PROGRESS} For more information, please review your{' '}
            <a href={serviceSettingsUrl} target="_blank" rel="noopener noreferrer">
              service settings
            </a>.
          </>
        );
      default:
        return (
          <>
            {MESSAGES.SCAN.DEFAULT} For more information, please review your{' '}
            <a href={serviceSettingsUrl} target="_blank" rel="noopener noreferrer">
              service settings
            </a>.
          </>
        );
    }
  };

  const renderUpgradeContent = () => {
    if (!upgraded) {
      return (
        <>
          <p className="upgrade-intro">{MESSAGES.UPGRADE.INTRO}</p>
          <ul className="upgrade-features">
            {MESSAGES.UPGRADE.FEATURES.map((feature, index) => (
              <li key={index}><strong>{feature}</strong></li>
            ))}
          </ul>
          <p className="ready-text">{MESSAGES.UPGRADE.READY}</p>
          <div className="upgrade-container">
            <button
              id="upgrade-now-button"
              className="cb-btn cb-primary-btn"
              onClick={() => window.open(`${ADMIN_URLS.SUBSCRIPTION_MANAGE}/${getNestedValue(user_data, 'subscriptions.active.subscription_id', '')}/manage`, '_blank')}
            >
              Upgrade now
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="subscription-info">
        <div>
          <div className="upgrade-header">
            <img src={require('../assets/img/icons/celebration.svg').default} alt="Celebration" className="celebration-icon" />
            <h3>You've upgraded to <span className="plan-name">{subscription_type}</span>!</h3>
          </div>
          <a
            href={`${ADMIN_URLS.SUBSCRIPTION_MANAGE}/${getNestedValue(user_data, 'subscriptions.active.subscription_id', '')}/manage`}
            className="manage-features-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>Manage advanced features</p>
          </a>
        </div>
        {getNestedValue(user_data, 'subscriptions.active.next_billing_date') && (
          <div className="billing-date">
            <img src={require('../assets/img/icons/calendar.svg').default} alt="Calendar" className="calendar-icon" />
            <h3>Next billing date: {formatDate(user_data.subscriptions.active.next_billing_date)}</h3>
          </div>
        )}
        <div className="manage-subscription">
          <button
            id="manage-subscription-button"
            className="cb-btn cb-primary-btn"
            onClick={() => window.open(`${ADMIN_URLS.SUBSCRIPTION_MANAGE}/${getNestedValue(user_data, 'subscriptions.active.subscription_id', '')}/manage`, '_blank')}
          >
            Manage subscription
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="gray-box">
      <div className="header-section-no-margin">
        <img src={require('../assets/img/icons/set-up-icon.svg').default} alt="Usercentrics Logo" />
        <h1>{cbid && !user_data ? 'Simplify your banner management' : 'Set up your consent banner'}</h1>
      </div>
      <div className="header-section">
        {!cbid && !user_data && (
          <p className="subtitle">
            Get your site GDPR-compliant in <strong>just a few clicks.</strong> Enter your email, verify it, and create your password.
          </p>
        )}
        {cbid && !user_data && (
          <p className="subtitle">
            Your setup is good to go - but we're making banner control even easier inside WordPress. <strong>Get access to new features</strong> by updating your banner today.
          </p>
        )}
      </div>
      <div className="steps-container">
        {/* Step 1: Activate Banner */}
        <div className={`step-box ${cbid ? 'completed' : ''}`}>
          <div className="step-row">
            <div className="step-icon">
              {cbid && user_data ? (
                <img src={checkMarkIcon} alt="Checkmark" />
              ) : (
                <div className="empty-circle"></div>
              )}
            </div>
            <div className="step-content">
              <h2>{cbid && !user_data ? 'Unlock new banner' : 'Activate your banner'}</h2>
            </div>
            {cbid && user_data && <span className="done-status">Done!</span>}
          </div>
          {!user_data && (
            <div className="banner-preview-container">
              <div className="divider"></div>
              <p className="step-description">
                {cbid && !user_data ? MESSAGES.BANNER.SIMPLIFIED : MESSAGES.BANNER.ACTIVATE}
              </p>
              <div className="banner-images">
                <img src={banner1} alt="Banner Preview 1" className="banner-image" />
                <img src={banner2} alt="Banner Preview 2" className="banner-image" />
              </div>
              {typeof onGetStarted === 'function' && (
                <div className="activate-container">
                  <button
                    id="get-started-button"
                    className="cb-btn cb-primary-btn cb-get-started-btn"
                    onClick={() => {
                      window.location.href = `${API_ENDPOINTS.AUTH}?origin=wordpress_plugin&callback_domain=${encodeURIComponent(getCallbackDomain())}`;
                    }}
                  >
                    Get Started
                  </button>
                  <img src={bannerArrow} alt="arrow" className="banner-arrow" />
                </div>
              )}
              {cbid && (
                <div className="note-text">
                  <img className="note-icon" src={infoIcon} alt="Info" />
                  <span>{MESSAGES.BANNER.NEW_ACCOUNT}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Scan Website */}
        {user_data && (
          <div className="step-box">
            <div className="step-row">
              <div className="step-icon">
                {scan_status === SCAN_STATUS.DONE ? (
                  <img src={checkMarkIcon} alt="Checkmark" />
                ) : (
                  <div className="empty-circle"></div>
                )}
              </div>
              <div className="step-content">
                <h2>Scan website</h2>
              </div>
              <div className="step-status">
                {renderScanStatus()}
                {scan_status !== SCAN_STATUS.DONE && (
                  <button className="expand-toggle" aria-expanded="false" aria-controls="scan-details">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
                      <path d="M7 10l5 5 5-5z" fill="#6B7280" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {scan_status !== SCAN_STATUS.DONE && (
              <div id="scan-details" className="scan-details">
                <div className="divider"></div>
                <p className="scan-message">{renderScanMessage()}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Upgrade Plan */}
        {user_data && (
          <div className="step-box">
            <div className="step-row">
              <div className="step-icon">
                {upgraded ? (
                  <img src={checkMarkIcon} alt="Checkmark" />
                ) : (
                  <div className="empty-circle"></div>
                )}
              </div>
              <div className="step-content">
                <h2>Upgrade your plan</h2>
              </div>
              {upgraded ? (
                <span className="done-status">Done!</span>
              ) : (
                <div className="step-status">
                  <div className="lightning-badge">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.58333 0.583344L1.75 8.16668H7L6.41667 13.4167L12.25 5.83334H7L7.58333 0.583344Z" fill="#0047FF" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="upgrade-details">
              <div className="divider"></div>
              {renderUpgradeContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupSteps; 