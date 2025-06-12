import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getData } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';

const screenWidth = Dimensions.get('window').width;

const defaultChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    data: [300, 450, 200, 600, 500, 400],
    color: (opacity = 1) => `rgba(58, 134, 255, ${opacity})`,
  }]
};

export default function ChartsTab() {
  const [blockTime, setBlockTime] = useState('');
  const [loadedChartData, setLoadedChartData] = useState(defaultChartData);
  const { blockAccount } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('chartData');
      if (data) setLoadedChartData(data);
    };
    loadData();
  }, []);

  const handleBlockAccount = () => {
    const minutes = parseInt(blockTime);
    if (!blockTime || isNaN(minutes) || minutes <= 0) return;

    blockAccount(minutes);
    setBlockTime('');
    alert(`Conta bloqueada por ${minutes} minutos`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gastos Mensais</Text>
      <LineChart
        data={loadedChartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#3A86FF',
          },
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.blockSection}>
        <Text style={styles.sectionHeader}>Bloquear Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Minutos"
          keyboardType="numeric"
          value={blockTime}
          onChangeText={setBlockTime}
        />
        <Button
          title="Bloquear Conta"
          onPress={handleBlockAccount}
          color="#FF006E"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  chart: { borderRadius: 16 },
  blockSection: { marginTop: 32 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
