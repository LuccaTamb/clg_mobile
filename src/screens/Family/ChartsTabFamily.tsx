import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getData } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';
import BlockButton from '../../components/BlockButton';

const screenWidth = Dimensions.get('window').width;

const defaultChartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      data: [300, 450, 200, 600, 500, 400],
      color: (opacity = 1) => `rgba(58, 134, 255, ${opacity})`,
    },
  ],
};

export default function ChartsTabFamily() {
  const [blockTime, setBlockTime] = useState('');
  const [chartData, setChartData] = useState<any>(null);
  const [accountBlockedUntil, setAccountBlockedUntil] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const { blockAccount, unblockAccount } = useAppContext();

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const storedData = await getData('chartData');
        setChartData(storedData || defaultChartData);
      } catch (err) {
        console.error('Erro ao carregar gráfico:', err);
        setChartData(defaultChartData);
      }
    };

    const checkBlock = async () => {
      const data = await getData('accountBlock');
      if (data?.blockedUntil && data.blockedUntil > Date.now()) {
        setAccountBlockedUntil(data.blockedUntil);
      } else {
        setAccountBlockedUntil(null);
      }
    };

    loadChartData();
    checkBlock();

    const interval = setInterval(() => {
      loadChartData();
      checkBlock();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!accountBlockedUntil) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = accountBlockedUntil - now;
      setRemainingTime(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [accountBlockedUntil]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleBlockAccount = () => {
    const minutes = parseInt(blockTime);
    if (!blockTime || isNaN(minutes) || minutes <= 0) {
      alert('Por favor, insira minutos válidos');
      return;
    }
    blockAccount(minutes);
    setBlockTime('');
    alert(`Conta bloqueada por ${minutes} minutos`);
  };

  // const handleUnblockAccount = async () => {
  //   await unblockAccount();
  //   setAccountBlockedUntil(null);
  //   setRemainingTime(0);
  //   alert('Conta desbloqueada com sucesso!');
  // };
  const handleUnblockAccount = async () => {
    await unblockAccount();
    const data = await getData('accountBlock');
    if (!data?.blockedUntil) {
      setAccountBlockedUntil(null);
      setRemainingTime(0);
      alert('Conta desbloqueada com sucesso!');
    } else {
      alert('Falha ao desbloquear a conta.');
    }
  };

  if (!chartData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando gráficos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Gastos Mensais (Paciente)</Text>
      <LineChart
        data={chartData}
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
        <Text style={styles.sectionHeader}>Bloquear Conta do Paciente</Text>
        <TextInput
          style={styles.input}
          placeholder="Minutos"
          keyboardType="numeric"
          value={blockTime}
          editable={!accountBlockedUntil}
          onChangeText={text => setBlockTime(text.replace(/[^0-9]/g, ''))}
        />
        <BlockButton
          title={accountBlockedUntil ? 'Desbloquear Conta' : 'Bloquear Conta'}
          onPress={accountBlockedUntil ? handleUnblockAccount : handleBlockAccount}
          color={accountBlockedUntil ? '#00C853' : '#FF006E'}
        />
        {accountBlockedUntil && (
          <Text style={styles.remainingTime}>Tempo restante: {formatTime(remainingTime)}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  chart: { borderRadius: 16, marginBottom: 20 },
  blockSection: { marginTop: 20, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  remainingTime: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
});
