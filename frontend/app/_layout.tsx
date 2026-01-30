import { Stack, router } from 'expo-router';
import './globals.css';
import ThemeProvider from '../src/contexts/ThemeContext';
import QueryProvider from '../src/contexts/QueryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { addNotificationResponseReceivedListener } from 'expo-notifications';
import { useEffect, useCallback } from 'react';
import { useRegisterUser } from '../src/hooks/useRegisterUser';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useRegisterUser();

  const [fontsLoaded] = useFonts({
    // DM Sans - body text
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    // Fraunces - display headings
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FAF7F2',
        }}
      >
        <ActivityIndicator size="large" color="#A7C4A0" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
