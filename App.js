// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PartidaScreen from './screens/PartidaScreen';
import PuntuacionScreen from './screens/PuntuacionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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