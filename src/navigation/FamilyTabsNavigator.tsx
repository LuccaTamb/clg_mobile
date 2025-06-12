import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LearningTabFamily from '../screens/Family/LearningTabFamily';
import ChartsTabFamily from '../screens/Family/ChartsTabFamily';
import AppsTabFamily from '../screens/Family/AppsTabFamily';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

export default function FamilyTabsNavigator({ navigation }: any) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: '#FF006E',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen 
        name="Aprendizagem" 
        component={LearningTabFamily}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Gráficos" 
        component={ChartsTabFamily}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen 
        name="Controle" 
        component={AppsTabFamily}
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
      color="#FF006E" 
      style={{ marginHorizontal: 15, alignSelf: 'center' }}
      onPress={() => navigation.navigate('Home')}
    />
  );
}