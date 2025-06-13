import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';

interface AppBlock {
  blockedUntil: number;
}

interface AppContextProps {
  isAccountBlocked: boolean;
  blockAccount: (minutes: number) => void;
  unblockAccount: () => Promise<void>; // Alterado para retornar Promise
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAccountBlocked, setIsAccountBlocked] = useState(false);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const blockData = await getData('accountBlock');
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

  const blockAccount = async (minutes: number) => {
    const blockedUntil = Date.now() + minutes * 60000;
    await storeData('accountBlock', { blockedUntil });
    setIsAccountBlocked(true);
  };

  // Função corrigida para desbloquear
  const unblockAccount = async () => {
    await storeData('accountBlock', null); // Armazena null para remover o bloqueio
    setIsAccountBlocked(false);
  };

  return (
    <AppContext.Provider value={{ 
      isAccountBlocked, 
      blockAccount, 
      unblockAccount 
    }}>
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