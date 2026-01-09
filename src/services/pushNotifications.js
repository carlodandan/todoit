const VAPID_PUBLIC_KEY = 'BLs_2q-VmP4py7epubmz_bRU-Se-tEwboReEBwUhJSMgkYtmsLPhxOUhAQ8PSH9v8aPH4PFeDMQ9b5qIVmTXWoM';

class PushNotificationService {
  constructor() {
    this.subscription = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    this.permission = null;
    this.notificationTimers = new Map();
    
    // Load saved subscription
    this.loadSubscription();
  }

  // Convert base64 to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if push notifications are supported
  checkSupport() {
    return this.isSupported;
  }

  // Get current notification permission
  getPermissionStatus() {
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported');
    }

    try {
      // Check permission
      if (this.permission !== 'granted') {
        this.permission = await this.requestPermission();
        if (this.permission !== 'granted') {
          throw new Error('Notification permission denied');
        }
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push service
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Save subscription
      this.saveSubscription(this.subscription);
      
      console.log('Push subscription successful');
      return this.subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    if (!this.subscription) return;

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      localStorage.removeItem('pushSubscription');
      console.log('Push subscription removed');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  }

  // Save subscription to localStorage
  saveSubscription(subscription) {
    try {
      const subscriptionJson = JSON.stringify(subscription);
      localStorage.setItem('pushSubscription', subscriptionJson);
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  // Load subscription from localStorage
  loadSubscription() {
    try {
      const subscriptionJson = localStorage.getItem('pushSubscription');
      if (subscriptionJson) {
        this.subscription = JSON.parse(subscriptionJson);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  }

  // Check if user is subscribed
  async isSubscribed() {
    if (!this.isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  // Schedule notification for todo due date
  scheduleTodoNotification(task) {
    if (!task.dueDate || !this.isSupported || task.completed) return;

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();

    // Clear any existing timer for this task
    this.cancelScheduledNotification(task.id);

    // Only schedule if due date is in the future
    if (timeUntilDue > 0) {
      // Schedule for 1 hour before due date
      const notificationTime = timeUntilDue - (60 * 60 * 1000);

      if (notificationTime > 0) {
        const timer1 = setTimeout(() => {
          this.sendTodoDueNotification(task, false);
        }, notificationTime);
        this.notificationTimers.set(`${task.id}-1h`, timer1);
      }

      // Schedule for exact due time
      const timer2 = setTimeout(() => {
        this.sendTodoDueNotification(task, true);
      }, timeUntilDue);
      this.notificationTimers.set(`${task.id}-due`, timer2);

      // Schedule for 10 minutes before (optional)
      const notificationTime10min = timeUntilDue - (10 * 60 * 1000);
      if (notificationTime10min > 0) {
        const timer3 = setTimeout(() => {
          this.sendTodoDueNotification(task, false, 10);
        }, notificationTime10min);
        this.notificationTimers.set(`${task.id}-10min`, timer3);
      }
    }
  }

  // Send notification for todo due date
  async sendTodoDueNotification(task, isDue = false, minutesBefore = 60) {
    if (!this.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const title = isDue 
        ? `⏰ "${task.text}" is due now!`
        : `⏳ "${task.text}" due in ${minutesBefore} minute${minutesBefore === 1 ? '' : 's'}`;

      const body = isDue
        ? 'Complete your task now!'
        : `Get ready to complete your task`;

      await registration.showNotification(title, {
        body,
        icon: '/icons/todoapp_192x192.png',
        badge: '/icons/todoapp_192x192.png',
        tag: `todo-${task.id}`,
        data: {
          todoId: task.id,
          url: window.location.href
        },
        actions: [
          {
            action: 'complete',
            title: '✅ Mark Complete'
          },
          {
            action: 'snooze',
            title: '⏰ Snooze 1 hour'
          }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    } catch (error) {
      console.error('Error sending todo notification:', error);
    }
  }

  // Cancel scheduled notification for a task
  cancelScheduledNotification(taskId) {
    // Clear 1-hour timer
    const timer1 = this.notificationTimers.get(`${taskId}-1h`);
    if (timer1) {
      clearTimeout(timer1);
      this.notificationTimers.delete(`${taskId}-1h`);
    }

    // Clear due timer
    const timer2 = this.notificationTimers.get(`${taskId}-due`);
    if (timer2) {
      clearTimeout(timer2);
      this.notificationTimers.delete(`${taskId}-due`);
    }

    // Clear 10-minute timer
    const timer3 = this.notificationTimers.get(`${taskId}-10min`);
    if (timer3) {
      clearTimeout(timer3);
      this.notificationTimers.delete(`${taskId}-10min`);
    }
  }

  // Cancel all scheduled notifications
  cancelAllScheduledNotifications() {
    this.notificationTimers.forEach(timer => {
      clearTimeout(timer);
    });
    this.notificationTimers.clear();
  }

  // Get subscription object for sending to server
  getSubscription() {
    return this.subscription;
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();