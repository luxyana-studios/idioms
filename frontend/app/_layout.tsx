import { Stack } from 'expo-router';
import './globals.css';
import ThemeProvider from '../src/contexts/ThemeContext';
import QueryProvider from '../src/contexts/QueryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <QueryProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
