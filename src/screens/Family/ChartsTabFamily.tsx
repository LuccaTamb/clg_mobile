import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getData, storeData } from '../../utils/storage';
import { useAppContext } from '../../context/AppContext';
import BlockButton from '../../components/BlockButton';
import { Ionicons } from '@expo/vector-icons';

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
  const { blockAccount, unblockAccount, isAccountBlocked } = useAppContext();

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

    const checkBlockStatus = async () => {
      try {
        const data = await getData('accountBlock');
        if (data?.blockedUntil) {
          if (data.blockedUntil > Date.now()) {
            setAccountBlockedUntil(data.blockedUntil);
            setRemainingTime(data.blockedUntil - Date.now());
          } else {
            // Desbloqueia se expirado
            await storeData('accountBlock', null);
            setAccountBlockedUntil(null);
          }
        } else {
          setAccountBlockedUntil(null);
        }
      } catch (error) {
        console.error('Erro ao verificar bloqueio:', error);
      }
    };

    loadChartData();
    checkBlockStatus();

    const interval = setInterval(() => {
      checkBlockStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!accountBlockedUntil) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = accountBlockedUntil - now;

      if (diff <= 0) {
        setRemainingTime(0);
        setAccountBlockedUntil(null);
        clearInterval(timer);
        storeData('accountBlock', null);
      } else {
        setRemainingTime(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [accountBlockedUntil]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleBlockAccount = async () => {
    const minutes = parseInt(blockTime);
    if (!blockTime || isNaN(minutes) || minutes <= 0) {
      Alert.alert('Valor inválido', 'Por favor, insira um número válido de minutos.');
      return;
    }

    try {
      await blockAccount(minutes);
      const data = await getData('accountBlock');
      if (data?.blockedUntil) {
        setAccountBlockedUntil(data.blockedUntil);
        setRemainingTime(data.blockedUntil - Date.now());
      }
      setBlockTime('');
      Alert.alert(`Conta bloqueada por ${minutes} minutos`);
    } catch (error) {
      console.error('Erro ao bloquear conta:', error);
      Alert.alert('Erro', 'Não foi possível bloquear a conta.');
    }
  };

  const handleUnblockAccount = async () => {
    try {
      Alert.alert(
        'Desbloquear Conta',
        'Tem certeza que deseja desbloquear a conta do paciente?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desbloquear', onPress: async () => {
              await unblockAccount();

              // Verificação direta no AsyncStorage
              const blockData = await getData('accountBlock');

              if (blockData === null) {
                setAccountBlockedUntil(null);
                setRemainingTime(0);
                Alert.alert('Sucesso', 'Conta desbloqueada com sucesso!');
              } else {
                Alert.alert('Erro', 'Falha ao desbloquear a conta. Tente novamente.');
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao desbloquear conta:', error);
      Alert.alert('Erro', 'Não foi possível desbloquear a conta.');
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

        {/* Mostrar cronômetro grande se bloqueado */}
        {accountBlockedUntil && (
          <View style={styles.largeTimerContainer}>
            <View style={styles.timerHeader}>
              <Ionicons name="lock-closed" size={32} color="#FF006E" />
              <Text style={styles.timerHeaderText}>Conta Bloqueada</Text>
            </View>
            <Text style={styles.largeTimerText}>
              {formatTime(remainingTime)}
            </Text>
            <Text style={styles.timerLabel}>Tempo restante</Text>
          </View>
        )}

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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  chart: {
    borderRadius: 16,
    marginBottom: 20
  },
  blockSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    width: '100%',
    textAlign: 'center',
  },
  largeTimerContainer: {
    backgroundColor: '#fff0f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd6e7',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF006E',
    marginLeft: 10,
  },
  largeTimerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF006E',
    textAlign: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});