import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WelcomeContextType {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (context === undefined) {
    throw new Error('useWelcome must be used within a WelcomeProvider');
  }
  return context;
};

interface WelcomeProviderProps {
  children: ReactNode;
}

export const WelcomeProvider = ({ children }: WelcomeProviderProps) => {
  const [showWelcome, setShowWelcome] = useState(true); // Durante desarrollo siempre true

  return (
    <WelcomeContext.Provider value={{ showWelcome, setShowWelcome }}>
      {children}
    </WelcomeContext.Provider>
  );
};
