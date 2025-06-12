import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PatientTabsNavigator from './PatientTabsNavigator';
import FamilyTabsNavigator from './FamilyTabsNavigator';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="Patient" 
        component={PatientTabsNavigator} 
      />
      <Stack.Screen 
        name="Family" 
        component={FamilyTabsNavigator} 
      />
    </Stack.Navigator>
  );
}