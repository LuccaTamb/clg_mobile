import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para salvar dados
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
};

// Função para carregar dados
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    return null;
  }
};

// Sincronização entre abas
export const syncData = async (key: string, callback: (data: any) => void) => {
  const load = async () => {
    const data = await getData(key);
    if (data) callback(data);
  };

  // Carrega inicialmente
  await load();
  
  // Sincroniza a cada 5 segundos
  setInterval(load, 5000);
};