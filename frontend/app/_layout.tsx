import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './contexts/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cards/[id]" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
