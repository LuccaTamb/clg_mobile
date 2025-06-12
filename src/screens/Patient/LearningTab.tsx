import { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import AppCard from '../../components/AppCard';
import { getData } from '../../utils/storage';
import { VideoItem } from '../../types';

const videos = [
  { id: 1, title: 'Gerenciamento Financeiro', url: 'https://www.youtube.com/watch?v=abc123' },
  { id: 2, title: 'Economia Doméstica', url: 'https://www.youtube.com/watch?v=def456' },
];

export default function LearningTab() {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const storedVideos = await getData('learningVideos');
      if (storedVideos) setVideos(storedVideos);
    };
    loadVideos();
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