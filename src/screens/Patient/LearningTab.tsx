import React, { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import AppCard from '../../components/AppCard';
import { getData } from '../../utils/storage';
import { VideoItem } from '../../types';

export default function LearningTab() {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const storedVideos = await getData('learningVideos');
      if (storedVideos) {
        setVideos(storedVideos);
      }
    };

    loadVideos();

    const interval = setInterval(loadVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      {videos.map((video) => (
        <AppCard
          key={video.id}
          title={video.title}
          onPress={() => handlePress(video.url)}
        />
      ))}
    </ScrollView>
  );
}
