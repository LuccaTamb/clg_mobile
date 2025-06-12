import { View, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          title="Família" 
          onPress={() => navigation.navigate('Family')} 
          color="#FF006E"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Paciente" 
          onPress={() => navigation.navigate('Patient')} 
          color="#3A86FF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});