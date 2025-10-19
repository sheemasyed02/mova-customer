import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface RateReviewNotificationData {
  bookingId: string;
  vehicleName: string;
  ownerName: string;
  vehicleImage?: string;
}

export class RateReviewNotificationManager {
  /**
   * Schedule a notification to prompt user to rate their experience
   * This should be called when a booking is completed
   */
  static async scheduleRatePromptNotification(
    data: RateReviewNotificationData,
    delayMinutes: number = 30
  ) {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delayMinutes * 60, // Convert minutes to seconds
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌟 Trip Completed!',
          body: `How was your experience with ${data.vehicleName}? Share your review and get ₹100 off your next booking!`,
          data: {
            type: 'RATE_REVIEW',
            ...data,
          },
        },
        trigger,
      });

      console.log('Rate review notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling rate review notification:', error);
    }
  }

  /**
   * Handle notification response when user taps on the notification
   */
  static handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data as any;
    
    if (data.type === 'RATE_REVIEW') {
      // Navigate to rate review screen
      router.push({
        pathname: '/rate-review' as any,
        params: {
          bookingId: String(data.bookingId || ''),
          vehicleName: String(data.vehicleName || ''),
          ownerName: String(data.ownerName || ''),
          vehicleImage: String(data.vehicleImage || ''),
        }
      });
    }
  }

  /**
   * Send immediate notification for completed booking
   */
  static async sendCompletionNotification(data: RateReviewNotificationData) {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // For immediate notifications, we can use scheduleNotificationAsync with immediate trigger
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Booking Completed',
          body: `Your trip with ${data.vehicleName} is complete! How was your experience?`,
          data: {
            type: 'RATE_REVIEW',
            ...data,
          },
        },
        trigger: null, // Immediate notification
      });
    } catch (error) {
      console.error('Error sending completion notification:', error);
    }
  }

  /**
   * Cancel all scheduled rate review notifications
   */
  static async cancelRatePromptNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.type === 'RATE_REVIEW') {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling rate review notifications:', error);
    }
  }

  /**
   * Setup notification response listener
   * This should be called in your main app component
   */
  static setupNotificationListener() {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );

    return subscription;
  }
}

// Example usage in booking completion flow:
/*
// When a booking is marked as completed:
await RateReviewNotificationManager.sendCompletionNotification({
  bookingId: 'MOV-12345',
  vehicleName: 'Hyundai Creta',
  ownerName: 'Amit Motors',
  vehicleImage: 'https://example.com/image.jpg'
});

// Schedule a follow-up reminder if user doesn't rate immediately:
await RateReviewNotificationManager.scheduleRatePromptNotification({
  bookingId: 'MOV-12345',
  vehicleName: 'Hyundai Creta',
  ownerName: 'Amit Motors',
  vehicleImage: 'https://example.com/image.jpg'
}, 60); // Remind after 1 hour
*/
