import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';
import { mockLearningVideos } from '../utils/mockData';
import { VideoItem } from '../types';

interface VideoContextProps {
  videos: VideoItem[];
  addVideo: (video: VideoItem) => void;
  removeVideo: (id: number) => void;
  reloadVideos: () => Promise<void>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<VideoItem[]>(mockLearningVideos);

  useEffect(() => {
    reloadVideos();
  }, []);

  const reloadVideos = async () => {
    const stored = await getData('learningVideos');
    if (stored) {
      setVideos(stored);
    } else {
      setVideos(mockLearningVideos);
    }
  };

  const addVideo = (video: VideoItem) => {
    const updated = [...videos, video];
    setVideos(updated);
    storeData('learningVideos', updated);
  };

  const removeVideo = (id: number) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    storeData('learningVideos', updated);
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, removeVideo, reloadVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext deve ser usado dentro de VideoProvider');
  }
  return context;
};
