import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';
import { mockAppUsage } from '../utils/mockData';
import { AppUsage } from '../types';

interface AppBlock {
  blockedUntil: number;
}

interface AppContextProps {
  isAccountBlocked: boolean;
  blockAccount: (minutes: number) => void;
  unblockAccount: () => Promise<void>;

  apps: AppUsage[];
  blockApp: (appId: string, minutes: number) => void;
  unblockApp: (appId: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAccountBlocked, setIsAccountBlocked] = useState(false);
  const [apps, setApps] = useState<AppUsage[]>(mockAppUsage);

  // Verifica bloqueio de conta
  useEffect(() => {
    const checkAccountBlock = async () => {
      const blockData = await getData('accountBlock');
      if (blockData && blockData.blockedUntil > Date.now()) {
        setIsAccountBlocked(true);
      } else {
        setIsAccountBlocked(false);
      }
    };

    checkAccountBlock();
    const interval = setInterval(checkAccountBlock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Carrega dados dos apps
  useEffect(() => {
    const loadApps = async () => {
      const storedApps = await getData('appUsage');
      if (storedApps) {
        setApps(storedApps);
      }
    };
    loadApps();
  }, []);

  // Salva apps no AsyncStorage sempre que mudar
  useEffect(() => {
    storeData('appUsage', apps);
  }, [apps]);

  // Bloqueio de conta
  const blockAccount = async (minutes: number) => {
    const blockedUntil = Date.now() + minutes * 60000;
    await storeData('accountBlock', { blockedUntil });
    setIsAccountBlocked(true);
  };

  const unblockAccount = async () => {
    await storeData('accountBlock', null);
    setIsAccountBlocked(false);
  };

  // 🔥 Bloqueio de app individual
  const blockApp = (appId: string, minutes: number) => {
    const blockedUntil = Date.now() + minutes * 60000;
    const updated = apps.map(app =>
      app.id === appId ? { ...app, blockedUntil } : app
    );
    setApps(updated);
  };

  const unblockApp = (appId: string) => {
    const updated = apps.map(app => {
      if (app.id === appId) {
        const { blockedUntil, ...rest } = app;
        return rest as AppUsage;
      }
      return app;
    });
    setApps(updated);
  };

  return (
    <AppContext.Provider value={{
      isAccountBlocked,
      blockAccount,
      unblockAccount,
      apps,
      blockApp,
      unblockApp,
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
