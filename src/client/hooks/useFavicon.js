import { useEffect } from 'react';

export const useFavicon = (href) => {
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    const previousHref = link.href;
    const previousType = link.type;
    
    link.href = href;
    if (href.endsWith('.png')) {
      link.type = 'image/png';
    } else if (href.endsWith('.ico')) {
      link.type = 'image/x-icon';
    }

    return () => {
      link.href = previousHref;
      if (previousType) {
        link.type = previousType;
      } else {
        link.removeAttribute('type');
      }
    };
  }, [href]);
};
