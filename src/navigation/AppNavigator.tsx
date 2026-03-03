import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import MapScreen     from '../screens/MapScreen';
import DexScreen     from '../screens/DexScreen';
import DetailScreen  from '../screens/DetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.bg },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="Map"     component={MapScreen}     />
        <Stack.Screen name="Dex"     component={DexScreen}     />
        <Stack.Screen name="Detail"  component={DetailScreen}  options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
