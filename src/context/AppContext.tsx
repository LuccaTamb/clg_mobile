import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';
import { mockAppUsage, mockLearningVideos } from '../utils/mockData';
import { AppUsage, VideoItem } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextProps {
  // Bloqueio da conta
  isAccountBlocked: boolean;
  blockAccount: (minutes: number) => void;
  unblockAccount: () => Promise<void>;

  // Apps
  apps: AppUsage[];
  blockApp: (appId: string, minutes: number) => void;
  unblockApp: (appId: string) => void;

  // Vídeos
  videos: VideoItem[];
  addVideo: (video: VideoItem) => void;
  removeVideo: (id: number) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAccountBlocked, setIsAccountBlocked] = useState(false);
  const [apps, setApps] = useState<AppUsage[]>(mockAppUsage);
  const [videos, setVideos] = useState<VideoItem[]>(mockLearningVideos);

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

  // Carrega dados dos apps e vídeos
  useEffect(() => {
    const loadApps = async () => {
      const storedApps = await getData('appUsage');
      if (storedApps) {
        setApps(storedApps);
      }
    };
    loadApps();

    const loadVideos = async () => {
      const storedVideos = await getData('learningVideos');
      if (storedVideos) {
        setVideos(storedVideos);
      }
    };
    loadVideos();
  }, []);

  // Salva apps sempre que mudar
  useEffect(() => {
    storeData('appUsage', apps);
  }, [apps]);

  // Salva vídeos sempre que mudar
  useEffect(() => {
    storeData('learningVideos', videos);
  }, [videos]);

  // Bloqueio de conta
  const blockAccount = async (minutes: number) => {
    const blockedUntil = Date.now() + minutes * 60000;
    await storeData('accountBlock', { blockedUntil });
    setIsAccountBlocked(true);
  };

  // const unblockAccount = async () => {
  //   try {
  //     await AsyncStorage.removeItem('accountBlock');
  //     setIsAccountBlocked(false);
  //   } catch (error) {
  //     console.error('Erro ao desbloquear conta:', error);
  //   }
  // };
  const unblockAccount = async () => {
    try {
      // Remove completamente o item do storage
      await AsyncStorage.removeItem('accountBlock');
      setIsAccountBlocked(false);
      console.log('Conta desbloqueada no contexto');
    } catch (error) {
      console.error('Erro ao desbloquear conta:', error);
      throw new Error('Falha ao desbloquear conta');
    }
  };

  //Apps
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

  //Vídeos
  const addVideo = (video: VideoItem) => {
    const updated = [...videos, video];
    setVideos(updated);
  };

  const removeVideo = (id: number) => {
    const updated = videos.filter(video => video.id !== id);
    setVideos(updated);
  };

  return (
    <AppContext.Provider value={{
      isAccountBlocked,
      blockAccount,
      unblockAccount,
      apps,
      blockApp,
      unblockApp,
      videos,
      addVideo,
      removeVideo,
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
