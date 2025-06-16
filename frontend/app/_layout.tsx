import { Stack } from 'expo-router';
import './globals.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { WelcomeProvider } from './contexts/WelcomeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WelcomeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="cards/[id]" options={{ headerShown: false }} />
        </Stack>
      </WelcomeProvider>
    </ThemeProvider>
  );
}
