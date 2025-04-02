// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import PartidaScreen from './screens/PartidaScreen';
import PuntuacionScreen from './screens/PuntuacionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F5FCFF',
          },
          headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A',
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