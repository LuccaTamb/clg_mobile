import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Storage limpíssimo!');
  } catch (e) {
    console.error('Erro ao limpar storage:', e);
  }
};
