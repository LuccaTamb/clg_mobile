import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import BlockButton from '../../components/BlockButton';
import { getData, storeData } from '../../utils/storage';
import { AppUsage } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const mockApps: AppUsage[] = [
  { id: '1', name: 'Instagram', usage: 120 },
  { id: '2', name: 'Facebook', usage: 90 },
  { id: '3', name: 'TikTok', usage: 150 },
];

export default function AppsTab() {
  const [apps, setApps] = useState<AppUsage[]>(mockApps);
  const [blockTimeInput, setBlockTimeInput] = useState<{ [key: string]: string }>({});
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  // Carregar dados do AsyncStorage
  useEffect(() => {
    const loadAppUsage = async () => {
      const storedApps = await getData('appUsage');
      if (storedApps) {
        setApps(storedApps);
        
        // Iniciar timers para apps já bloqueados
        storedApps.forEach((app: AppUsage) => {  // Corrigido aqui: adicionei a tipagem
          if (app.blockedUntil && app.blockedUntil > Date.now()) {
            startTimer(app.id, app.blockedUntil);
          }
        });
      }
    };
    loadAppUsage();
    
    return () => {
      // Limpar todos os timers ao desmontar
      Object.values(timersRef.current).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, []);

  const startTimer = (appId: string, blockedUntil: number) => {
    // Limpar timer existente se houver
    if (timersRef.current[appId]) {
      clearInterval(timersRef.current[appId]!);
    }
    
    const timer = setInterval(() => {
      setApps(prevApps => 
        prevApps.map(app => {
          if (app.id === appId) {
            const remaining = blockedUntil - Date.now();
            
            if (remaining <= 0) {
              clearInterval(timer);
              timersRef.current[appId] = null;
              // Remover as propriedades de bloqueio
              const { blockedUntil, remaining, ...rest } = app;
              return rest;
            }
            
            return { ...app, remaining };
          }
          return app;
        })
      );
    }, 1000);
    
    timersRef.current[appId] = timer;
  };

  const handleBlockApp = async (appId: string) => {
    const time = blockTimeInput[appId];
    if (!time) return;

    const minutes = parseInt(time);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert('Valor inválido', 'Por favor, insira um número válido de minutos.');
      return;
    }

    const blockedUntil = Date.now() + minutes * 60000;
    
    const updatedApps = apps.map(app => 
      app.id === appId ? { ...app, blockedUntil, remaining: minutes * 60000 } : app
    );
    
    setApps(updatedApps);
    await storeData('appUsage', updatedApps);
    setBlockTimeInput({ ...blockTimeInput, [appId]: '' });
    
    // Iniciar o cronômetro
    startTimer(appId, blockedUntil);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                <View style={styles.timerContainer}>
                  <Ionicons name="time-outline" size={16} color="#FF006E" />
                  <Text style={styles.timerText}>
                    {formatTime(item.remaining || 0)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.blockContainer}>
              <TextInput
                style={styles.input}
                placeholder="Minutos"
                keyboardType="numeric"
                value={blockTimeInput[item.id] || ''}
                onChangeText={text => {
                  // Permite apenas números
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setBlockTimeInput({ ...blockTimeInput, [item.id]: numericValue });
                }}
              />
              <BlockButton
                title="Bloquear"
                onPress={() => handleBlockApp(item.id)}
                color="#FF006E"
                disabled={!!(item.blockedUntil && item.blockedUntil > Date.now())} 
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
    marginTop: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timerText: {
    color: '#FF006E',
    marginLeft: 4,
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