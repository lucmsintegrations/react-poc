import React from 'react';
import clockIcon from '../assets/img/icons/clock-icon.svg';
import checkGreenIcon from '../assets/img/icons/check-green.svg';
import checkWhiteIcon from '../assets/img/icons/check-white.svg';

const TopBanners = ({ wpData, bannerLiveDismissed, setBannerLiveDismissed }) => {
  const { cbid, user_data, trial_expired, upgraded, preview_link } = wpData;

  const handleCloseBanner = () => {
    setBannerLiveDismissed(true);
    // Save to WordPress if needed via API call
  };

  return (
    <>
      {/* Trial expiration notice */}
      {trial_expired && !upgraded && (
        <div className="header-top-banners trial-expired-banner">
          <div className="banner-content">
            <img src={clockIcon} alt="Clock Icon" />
            <div>
              <h3>Your premium trial is over</h3>
              <p>
                Reactive your banner to regain full access to your account and display the cookie banner on your website.
              </p>
            </div>
          </div>
          <div className="upgrade-expired-trial">
            <a 
              href={`https://account.usercentrics.eu/subscription/${user_data?.subscriptions?.active?.subscription_id || ''}/manage`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>Reactivate banner <span className="upgrade-chevron">›</span></h3>
            </a>
          </div>
        </div>
      )}

      {/* Banner connected notice */}
      {cbid && !user_data && (
        <div className="header-top-banners connected-banner">
          <div className="banner-content">
            <img src={checkGreenIcon} alt="Check Icon" />
            <div>
              <h3>Your banner is connected!</h3>
              <p style={{ textWrap: 'nowrap' }}>
                Everything works as before. Manage your banner in the{' '}
                <a href="https://manager.cookiebot.com/" target="_blank" rel="noopener noreferrer">
                  Cookiebot Manager
                </a>
                {' '}or{' '}
                <a href="https://admin.usercentrics.eu/" target="_blank" rel="noopener noreferrer">
                  Usercentrics Admin
                </a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner is live notice */}
      {cbid && user_data && !bannerLiveDismissed && (
        <div className="header-top-banners banner-live-banner" id="banner-live-notice">
          <div className="banner-content">
            <img src={checkWhiteIcon} alt="Check Icon" />
            <div>
              <h3>
                Well done! Your{' '}
                <a href={preview_link || '/'} target="_blank" rel="noopener noreferrer" className="banner-live-link">
                  banner is live
                </a>.
              </h3>
              <p>
                If you've signed up or logged in for the first time, your banner may take a few seconds to load on your website.
              </p>
            </div>
          </div>
          <button 
            className="banner-close-btn" 
            aria-label="Close banner" 
            onClick={handleCloseBanner}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </>
  );
};

export default TopBanners; 