import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Colors } from '../theme';
import MapScreen     from '../screens/MapScreen';
import DexScreen     from '../screens/DexScreen';
import DetailScreen  from '../screens/DetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

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
          ...TransitionPresets.SlideFromRightIOS,
          cardStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="Map"     component={MapScreen}     />
        <Stack.Screen name="Dex"     component={DexScreen}     />
        <Stack.Screen name="Detail"  component={DetailScreen}  options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
