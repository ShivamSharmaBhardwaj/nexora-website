// frontend/src/hooks/useSecurity.js
import { useEffect } from 'react';
import { disableConsoleInProduction, detectDevTools } from '../utils/security';

export const useSecurity = () => {
  useEffect(() => {
    // Disable console in production
    disableConsoleInProduction();
    
    // Detect DevTools
    const checkDevTools = () => {
      detectDevTools();
    };
    
    // Check on resize (DevTools open detection)
    window.addEventListener('resize', checkDevTools);
    
    // Initial check
    checkDevTools();
    
    return () => {
      window.removeEventListener('resize', checkDevTools);
    };
  }, []);
};