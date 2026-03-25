import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

// A way to compleatly work around to load diverent 
// Languages so that evey one is capeble of using it 
// as they see fit in theyr own Langugae
function formatMessage(message, values) {
  if (!message) return '';
  if (!values) return message;
  return Object.keys(values).reduce(
    (acc, key) => acc.replace(`{${key}}`, values[key]),
    message
  );
}

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('userLang');
    const browserLang = navigator.language.split('-')[0];
    return saved || browserLang || 'de';
  });

  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async (lang) => {
      setIsLoading(true);
      try {
        const module = await import(`../locales/${lang}.json`);
        setMessages(module.default);
        localStorage.setItem('userLang', lang);
        document.documentElement.lang = lang;
      } catch (error) {
        console.error(`Failed to load translations for ${lang}`, error);
        // fallback to en
        if (lang !== 'de') {
          const fallback = await import('../locales/de.json');
          setMessages(fallback.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations(locale);
  }, [locale]);

  const t = (id, values) => {
    if (!messages[id]) {
      console.warn(`Missing translation: ${id} for ${locale}`);
      return id; // fallback to showing the key
    }
    return formatMessage(messages[id], values);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
