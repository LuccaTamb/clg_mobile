import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { AppProvider } from './src/context/AppContext';
import { useEffect } from 'react';
import { getData, storeData } from './src/utils/storage'; 
import { mockAppUsage, mockLearningVideos, mockChartData } from './src/utils/mockData';

export default function App() {
  useEffect(() => {
    const initializeData = async () => {
      // Verifica e inicializa apenas se não existir
      const existingApps = await getData('appUsage');
      if (!existingApps) await storeData('appUsage', mockAppUsage);
      
      const existingVideos = await getData('learningVideos');
      if (!existingVideos) await storeData('learningVideos', mockLearningVideos);
      
      const existingChart = await getData('chartData');
      if (!existingChart) await storeData('chartData', mockChartData);
    };
    initializeData();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}


// ngc pra arrumar os dados, nao mexe

// import { NavigationContainer } from '@react-navigation/native';
// import MainNavigator from './src/navigation/MainNavigator';
// import { AppProvider } from './src/context/AppContext';
// import { useEffect } from 'react';
// import { getData, storeData } from './src/utils/storage';
// import { mockAppUsage, mockLearningVideos, mockChartData } from './src/utils/mockData';
// import { clearStorage } from './src/utils/ClearStorage';

// export default function App() {
//   useEffect(() => {
//     const initializeData = async () => {
//       // Verifica e inicializa apenas se não existir
//       const existingApps = await getData('appUsage');
//       if (!existingApps) await storeData('appUsage', mockAppUsage);

//       const existingVideos = await getData('learningVideos');
//       if (!existingVideos) await storeData('learningVideos', mockLearningVideos);

//       const existingChart = await getData('chartData');
//       if (!existingChart) await storeData('chartData', mockChartData);
//     };
//     initializeData();
//   }, []);

//   useEffect(() => {
//     clearStorage();
//   }, []);

//   return (
//     <AppProvider>
//       <NavigationContainer>
//         <MainNavigator />
//       </NavigationContainer>
//     </AppProvider>
//   );
// }