import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import BlockButton from '../../components/BlockButton';
import { getData, storeData } from '../../utils/storage';
import { AppUsage } from '../../types';

const mockApps: AppUsage[] = [
  { id: '1', name: 'Instagram', usage: 120 },
  { id: '2', name: 'Facebook', usage: 90 },
  { id: '3', name: 'TikTok', usage: 150 },
];

export default function AppsTab() {
  const [apps, setApps] = useState<AppUsage[]>(mockApps);
  const [blockTime, setBlockTime] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadAppUsage = async () => {
      const storedApps = await getData('appUsage');
      if (storedApps) setApps(storedApps);
    };
    loadAppUsage();
  }, []);

  const handleBlockApp = async (appId: string) => {
    const time = blockTime[appId];
    if (!time) return;

    const minutes = parseInt(time);
    if (isNaN(minutes)) return;

    const updatedApps = apps.map(app => 
      app.id === appId ? { ...app, blockedUntil: Date.now() + minutes * 60000 } : app
    );
    
    setApps(updatedApps);
    await storeData('appUsage', updatedApps);
    setBlockTime({ ...blockTime, [appId]: '' });
    alert(`App bloqueado por ${minutes} minutos`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Controle de Aplicativos</Text>
      <FlatList
        data={apps}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.appItem}>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{item.name}</Text>
              <Text style={styles.usage}>{item.usage} minutos hoje</Text>
              {item.blockedUntil && item.blockedUntil > Date.now() && (
                <Text style={styles.blockedText}>Bloqueado</Text>
              )}
            </View>
            <View style={styles.blockContainer}>
              <TextInput
                style={styles.input}
                placeholder="Minutos"
                keyboardType="numeric"
                value={blockTime[item.id] || ''}
                onChangeText={text => setBlockTime({ ...blockTime, [item.id]: text })}
              />
              <BlockButton
                title="Bloquear"
                onPress={() => handleBlockApp(item.id)}
                color="#FF006E"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usage: {
    color: '#666',
  },
  blockedText: {
    color: '#FF006E',
    fontWeight: 'bold',
  },
  blockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});