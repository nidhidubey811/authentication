import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import ExecutiveDashboard from './screens/ExecutiveDashboard';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ExecutiveDashboard" component={ExecutiveDashboard} />
    </Stack.Navigator>
  );
};
export default AppNavigator;
