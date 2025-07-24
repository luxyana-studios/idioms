import {
  setNotificationHandler,
  requestPermissionsAsync,
  cancelAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { fetchShuffledCards } from '../services/cardService';

// Configure notification behavior when the app is in the foreground
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useDailyNotification() {
  useEffect(() => {
    async function scheduleDailyNotification() {
      const { status } = await requestPermissionsAsync();
      if (status !== 'granted') return;

      await cancelAllScheduledNotificationsAsync();

      let idiom = null;
      try {
        const shuffled = await fetchShuffledCards(1, 1);
        idiom = shuffled[0];
      } catch (e) {
        idiom = null;
      }
      const title = idiom
        ? `Idiom of the day: ${idiom.text} ${idiom.depiction?.join(' ') || ''}`
        : 'Time to learn a new idiom!';
      const body = idiom
        ? 'Tap to see the meaning and examples.'
        : "Open the app and discover today's idiom.";

      await scheduleNotificationAsync({
        content: {
          title,
          body,
          data: idiom ? { idiomId: idiom.id } : undefined,
        },
        trigger: { seconds: 10 } as any, // para que llegue en 10 segundos
      });
    }

    scheduleDailyNotification();
  }, []);
}
