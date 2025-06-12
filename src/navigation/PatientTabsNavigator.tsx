import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LearningTab from '../screens/Patient/LearningTab';
import ChartsTab from '../screens/Patient/ChartsTab';
import AppsTab from '../screens/Patient/AppsTab';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function PatientTabsNavigator({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: '#3A86FF',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen 
        name="Aprendizagem" 
        component={LearningTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Gráficos" 
        component={ChartsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Controle" 
        component={AppsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="phone-portrait" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarButton: () => (
            <TabBarHomeButton navigation={navigation} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function TabBarHomeButton({ navigation }: any) {
  return (
    <Ionicons 
      name="home" 
      size={28} 
      color="#3A86FF" 
      style={{ marginHorizontal: 15, alignSelf: 'center' }}
      onPress={() => navigation.navigate('Home')}
    />
  );
}