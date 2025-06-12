import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

type AppCardProps = {
  title: string;
  onPress: () => void;
};

export default function AppCard({ title, onPress }: AppCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});