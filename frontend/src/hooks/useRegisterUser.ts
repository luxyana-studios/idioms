import { useEffect } from 'react';
import { registerOrGetApiKey } from '../services/userService';

export const useRegisterUser = () => {
  useEffect(() => {
    // registerOrGetApiKey already checks storage and returns early if an API key exists,
    // so we can call it unconditionally here and keep the hook simple.
    (async () => {
      await registerOrGetApiKey();
    })();
  }, []);
};
