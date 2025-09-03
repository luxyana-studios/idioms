import { useEffect } from 'react';
import { registerOrGetApiKey } from '../services/userService';

/**
 * Hook to register the installation with the backend and persist the api key.
 * Call this once at app startup (for example in App layout/_layout.tsx).
 */
export const useRegisterUser = () => {
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const key = await registerOrGetApiKey();
      if (mounted) {
        // Optionally you can set it in some context or logger
        // console.log('API key:', key ? 'stored' : 'none');
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);
};
