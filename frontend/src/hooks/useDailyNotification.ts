import {
  setNotificationHandler,
  requestPermissionsAsync,
  cancelAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { useCallback } from 'react';

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
  const sendTestNotification = useCallback(async () => {
    const { status } = await requestPermissionsAsync();
    if (status !== 'granted') return;

    await cancelAllScheduledNotificationsAsync();

    await scheduleNotificationAsync({
      content: {
        title: 'Idiom Daily - Test',
        body: 'This is a test notification from the frontend.',
        data: { source: 'frontend-test' },
      },
      trigger: null as any,
    });
  }, []);

  return { sendTestNotification };
}
