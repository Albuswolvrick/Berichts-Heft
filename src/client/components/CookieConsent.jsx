import React, { useState, useEffect } from 'react';
import '../../../public/css/CookieConsent.css';

const CookieConsent = ({ isAuthenticated }) => {
  const [showBanner, setShowBanner] = useState(false);

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
          to insure a save enviorment we hadle your data with the up most care.
          as a general information to all Users we have to write you that we use cookies.
          We use cookies to ensure you have the best experience on our site.
          We also track your last login time and IP address for security purposes.
          By clicking "Accept", you agree to our data collection policies.
          If you are not alright pls leave the site.
        </p>
        <button onClick={handleAccept} className="cookie-consent-button">
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
