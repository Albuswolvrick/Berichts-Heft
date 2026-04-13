import React, { useState, createContext, useContext, useEffect } from 'react';

const TextSizeContext = createContext();

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize must be used within a TextSizeProvider');
  }
  return context;
};

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState(() => {
    const saved = localStorage.getItem('textSize');
    return saved ? parseInt(saved, 10) : 16;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--base-font-size', textSize + 'px');
    localStorage.setItem('textSize', textSize.toString());
  }, [textSize]);

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};
