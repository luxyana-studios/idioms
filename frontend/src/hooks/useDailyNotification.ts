import {
  setNotificationHandler,
  requestPermissionsAsync,
  cancelAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { useCallback } from 'react';

/**
 * Global handler for how notifications are presented when received.
 */
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Hook to manage local notifications.
 * Now supports scheduling a repeating notification every 5 minutes.
 *
 * Notes:
 * - On iOS and Android, Expo supports timeInterval triggers in seconds.
 * - repeats: true will keep it firing every interval even after app restarts,
 *   as scheduling is persisted by the OS.
 */
export function useDailyNotification() {
  /**
   * Schedules a repeating notification every 5 minutes.
   * It first requests permission and clears previous schedules to avoid duplicates.
   */
  const scheduleEveryFiveMinutes = useCallback(async () => {
    const { status } = await requestPermissionsAsync();
    if (status !== 'granted') return;

    // Optional: clear previous schedules so we only keep one repeating notification.
    await cancelAllScheduledNotificationsAsync();

    // 5 minutes = 300 seconds
    await scheduleNotificationAsync({
      content: {
        title: 'Idiom Daily',
        body: 'Learn a new idiom every 5 minutes.',
        data: { source: 'frontend-5min' },
      },
      trigger: {
        seconds: 300,
        repeats: true,
      } as any,
    });
  }, []);

  /**
   * Cancels all scheduled notifications (useful to stop the repeating timer).
   */
  const cancelAll = useCallback(async () => {
    await cancelAllScheduledNotificationsAsync();
  }, []);

  return { scheduleEveryFiveMinutes, cancelAll };
}
