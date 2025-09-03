import { Stack, router } from 'expo-router';
import './globals.css';
import ThemeProvider from '../src/contexts/ThemeContext';
import QueryProvider from '../src/contexts/QueryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { addNotificationResponseReceivedListener } from 'expo-notifications';
import { useEffect } from 'react';
import { useRegisterUser } from '../src/hooks/useRegisterUser';

export default function RootLayout() {
  useRegisterUser();

  useEffect(() => {
    const subscription = addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      const idiomId = response.notification.request.content.data?.idiomId;
      console.log('idiomId from notification:', idiomId);
      if (typeof idiomId === 'string' && idiomId.length > 0) {
        router.push(`/(drawer)/shuffle?idiomId=${encodeURIComponent(idiomId)}`);
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <QueryProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
