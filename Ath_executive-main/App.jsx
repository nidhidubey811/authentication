import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './AppNavigator';

enableScreens();
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};
export default App;
