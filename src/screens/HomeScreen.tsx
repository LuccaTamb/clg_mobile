import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'patient' | 'family' | null>(null);

  // Credenciais mockadas
  const MOCK_CREDENTIALS = {
    patient: {
      email: 'paciente@clinica.com',
      password: 'paciente123'
    },
    family: {
      email: 'familia@clinica.com',
      password: 'familia123'
    }
  };

  // Verificar se há credenciais salvas ao carregar a tela
  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('rememberedEmail');
      if (storedEmail) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Erro ao recuperar credenciais:', error);
    }
  };

  const handleLogin = async (role: 'patient' | 'family') => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setSelectedRole(role);
    setIsLoading(true);

    // Simular processo de autenticação
    setTimeout(async () => {
      setIsLoading(false);
      
      // Verificar credenciais mockadas para o papel selecionado
      const credentials = MOCK_CREDENTIALS[role];
      if (email === credentials.email && password === credentials.password) {
        // Salvar email se "Lembrar-me" estiver marcado
        if (rememberMe) {
          try {
            await AsyncStorage.setItem('rememberedEmail', email);
          } catch (error) {
            console.error('Erro ao salvar email:', error);
          }
        } else {
          // Remover email salvo se "Lembrar-me" não estiver marcado
          try {
            await AsyncStorage.removeItem('rememberedEmail');
          } catch (error) {
            console.error('Erro ao remover email:', error);
          }
        }
        
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        // Navegar para a tela apropriada baseada no papel
        navigation.navigate(role === 'patient' ? 'Patient' : 'Family');
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos para o tipo de conta selecionado');
      }
    }, 1500); // Simular tempo de espera de 1.5 segundos
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* Logo ou título do aplicativo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://placehold.co/100x100/3A86FF/FFFFFF/png?text=CLG' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>CLG Mobile</Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>
        </View>

        {/* Formulário de login */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          
          <View style={styles.rememberContainer}>
            <TouchableOpacity 
              style={styles.rememberCheck}
              onPress={() => !isLoading && setRememberMe(!rememberMe)}
              disabled={isLoading}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Lembrar-me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity disabled={isLoading}>
              <Text style={styles.forgotPassword}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>
          
          {/* Botões de login separados */}
          <View style={styles.loginButtonsContainer}>
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                styles.patientButton,
                (isLoading && selectedRole !== 'patient') && styles.buttonDisabled
              ]} 
              onPress={() => handleLogin('patient')}
              disabled={isLoading && selectedRole !== 'patient'}
            >
              {isLoading && selectedRole === 'patient' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar como Paciente</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                styles.familyButton,
                (isLoading && selectedRole !== 'family') && styles.buttonDisabled
              ]} 
              onPress={() => handleLogin('family')}
              disabled={isLoading && selectedRole !== 'family'}
            >
              {isLoading && selectedRole === 'family' ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar como Família</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Dica das credenciais mockadas (remova em produção) */}
          <View style={styles.credentialsHint}>
            <Text style={styles.credentialsTitle}>Credenciais de teste:</Text>
            <Text style={styles.credentialsText}>Paciente: paciente@clinica.com / paciente123</Text>
            <Text style={styles.credentialsText}>Família: familia@clinica.com / familia123</Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity disabled={isLoading}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3A86FF',
    borderColor: '#3A86FF',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rememberText: {
    color: '#666',
  },
  forgotPassword: {
    color: '#3A86FF',
    fontWeight: '500',
  },
  loginButtonsContainer: {
    marginBottom: 15,
  },
  loginButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  patientButton: {
    backgroundColor: '#3A86FF',
  },
  familyButton: {
    backgroundColor: '#FF006E',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  credentialsHint: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3A86FF',
  },
  credentialsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3A86FF',
    marginBottom: 5,
  },
  credentialsText: {
    fontSize: 12,
    color: '#3A86FF',
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    marginRight: 5,
  },
  footerLink: {
    color: '#3A86FF',
    fontWeight: '500',
  },
});