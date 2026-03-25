import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
//a selectore for diverent Languages
//hope this shit works as wanted 
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'uk', name: 'Українська' }
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
    <div className="language-selector" ref={dropdownRef} style={{ position: 'relative', margin: '10px 0' }}>
      <button
        className="nav-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >{/**
        *this is a button to select the language
        *Iwish for a good emojy heare and I do not want to search for it myself
        *so I will just put a placeholder here and hope for the best
        *yet the globe is not a good emoji
        */}
        <span> ️ {currentLang.name}</span>
        <span>{isOpen ? '' : ''}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: 'var(--bg-card, #2a2a2a)', border: '1px solid var(--border-color, #444)',
          borderRadius: '4px', zIndex: 1000, marginTop: '4px', padding: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            placeholder={t('lang.search') || "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '6px', marginBottom: '8px',
              boxSizing: 'border-box', backgroundColor: 'var(--bg-input, #333)',
              color: 'var(--text-primary, #fff)', border: '1px solid var(--border-color, #555)',
              borderRadius: '4px'
            }}
          />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
            {filteredLanguages.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px',
                    backgroundColor: locale === lang.code ? 'var(--accent-color, #007bff)' : 'transparent',
                    color: 'var(--text-primary, #fff)', border: 'none', cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--bg-hover, #444)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = locale === lang.code ? 'var(--accent-color, #007bff)' : 'transparent'}
                >
                  {lang.name}
                </button>
              </li>
            ))}
            {filteredLanguages.length === 0 && (
              <li style={{ padding: '8px', color: '#999', textAlign: 'center' }}>No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
