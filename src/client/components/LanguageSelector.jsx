import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../../../public/css/LanguageSelector.css';

//a selectore for diverent Languages
//added those Languages and for now I do not plan on ading any more Languages if you want to ad more 
// ad a json data in client/locales/ and import it here after that ad it with the Folowing heare 
// {code: '(name of the json file without .json)', name: '(Language name optimal the native name )'},
const LANGUAGES = [

  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'bayer', name: 'Bayerisch', flag: '🇩🇪' },
  { code: 'frisish', name: 'Plat', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'lat', name: 'Latin', flag: '🇻🇦' },
  { code: 'brit', name: 'British', flag: '🇬🇧' },
  { code: 'sp', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pirat', name: 'Pirat', flag: '🏴‍☠️' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'ir', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ch', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'rus', name: 'Русский', flag: '🇷🇺' }
];

const LanguageSelector = () => {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="nav-button"
        onClick={() => setIsOpen(!isOpen)}
      >  {/**
        *this is a button to select the language
        *Iwish for a good emojy heare and I do not want to search for it myself
        *so I will just put a placeholder here and hope for the best
        *yet the globe is not a good emoji
        */}
        <span>🌐 {currentLang.name} {currentLang.flag}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <input
            type="text"
            className="language-search"
            placeholder={t('lang.search') === 'lang.search' ? "Search..." : (t('lang.search') || "Search...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="language-list">
            {filteredLanguages.map(lang => (
              <li key={lang.code}>
                <button
                  className={`language-item-btn ${locale === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {lang.name}
                  {lang.flag}
                </button>
              </li>
            ))}
            {filteredLanguages.length === 0 && (
              <li className="language-no-results">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
