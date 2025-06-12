import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';

interface AppBlock {
  blockedUntil: number;
}

interface AppContextProps {
  isAccountBlocked: boolean;
  blockAccount: (minutes: number) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

//export const AppProvider: React.FC = ({ children }) => {
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAccountBlocked, setIsAccountBlocked] = useState(false);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const blockData: AppBlock = await getData('accountBlock');
      if (blockData && blockData.blockedUntil > Date.now()) {
        setIsAccountBlocked(true);
      } else {
        setIsAccountBlocked(false);
      }
    };

    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const unblockAccount = async () => {
    await storeData('accountBlock', null);
    setIsAccountBlocked(false);
  };

  const blockAccount = async (minutes: number) => {
    const blockedUntil = Date.now() + minutes * 60000;
    await storeData('accountBlock', { blockedUntil });
    setIsAccountBlocked(true);
  };

  return (
    <AppContext.Provider value={{ isAccountBlocked, blockAccount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider');
  }
  return context;
};
