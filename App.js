// App.js
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PartidaScreen from './screens/PartidaScreen';
import PuntuacionScreen from './screens/PuntuacionScreen';

const Stack = createNativeStackNavigator();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#333333',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C1C1E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Cricket Darts' }}
        />
        <Stack.Screen 
          name="Partida" 
          component={PartidaScreen} 
          options={{ title: 'Partida en Curso' }}
        />
        <Stack.Screen 
          name="Puntuacion" 
          component={PuntuacionScreen} 
          options={{ title: 'Resultados' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}