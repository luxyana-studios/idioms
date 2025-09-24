import { useState, useEffect } from 'react';
import { registerOrGetApiKey } from '../services/userService';

interface UseRegisterUserReturn {
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  retry: () => void;
}

export const useRegisterUser = (): UseRegisterUserReturn => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const authenticate = async () => {
    const apiKey = await registerOrGetApiKey();

    if (apiKey) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setIsAuthenticated(false);
      setAuthError('Failed to authenticate');
    }

    setIsAuthenticating(false);
  };

  useEffect(() => {
    authenticate();
  }, []);

  const retry = () => {
    setIsAuthenticating(true);
    setAuthError(null);
    authenticate();
  };

  return { isAuthenticating, isAuthenticated, authError, retry };
};
