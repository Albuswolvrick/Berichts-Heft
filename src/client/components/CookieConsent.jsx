import React, { useState, useEffect } from 'react';
import '../../../public/css/CookieConsent.css';
import { useLanguage } from '../hooks/useLanguage';

const CookieConsent = ({ isAuthenticated }) => {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Only show if logged in and consent not already given
    const consent = localStorage.getItem('cookieConsent');
    if (isAuthenticated && !consent) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isAuthenticated]);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-consent-content">
        <p>
          {t('cookie.text')}
        </p>
        <button onClick={handleAccept} className="cookie-consent-button">
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
