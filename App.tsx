import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importaciones de contextos
import { LanguageProvider } from './src/contexts/LanguageContext';

// Importación de pantallas
import HomeScreen from './src/screens/HomeScreen';

// Tipos de navegación
export type RootStackParamList = {
  Home: undefined;
  // Añadirás más pantallas después
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false, // Oculta el header por defecto
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
