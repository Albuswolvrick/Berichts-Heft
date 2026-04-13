import React from 'react';
import { useTextSize } from '../hooks/useTextSize';
import { useLanguage } from '../hooks/useLanguage';

const TextSizeSelector = () => {
  const { textSize, setTextSize } = useTextSize();
  const { t } = useLanguage();

  return (
    <div className="text-size-selector" style={{ padding: '10px 15px', borderBottom: '1px solid var(--secondary-color)', marginBottom: '10px' }}>
      <label 
        htmlFor="text-size-slider" 
        style={{ 
          display: 'block', 
          fontSize: '0.75rem', 
          color: 'var(--secondary-color)', 
          marginBottom: '8px',
          fontWeight: '600'
        }}
      >
        {t('settings.text_size') || 'Text Size'}: {textSize}px
      </label>
      <input
        id="text-size-slider"
        type="range"
        min="12"
        max="40"
        value={textSize}
        onChange={(e) => setTextSize(parseInt(e.target.value, 10))}
        style={{
          width: '100%',
          cursor: 'pointer',
          accentColor: 'var(--primary-color)'
        }}
      />
    </div>
  );
};

export default TextSizeSelector;
