import { useState, useEffect } from 'react'
import { addDays, isBefore, isToday, isTomorrow } from 'date-fns'
import { pushNotificationService } from '../services/pushNotifications'

export const useNotifications = (tasks) => {
  const [notifications, setNotifications] = useState([])
  const [pushEnabled, setPushEnabled] = useState(false)

  // Check push notification support and status
  useEffect(() => {
    const checkPushStatus = async () => {
      if (pushNotificationService.checkSupport()) {
        const isSubscribed = await pushNotificationService.isSubscribed();
        setPushEnabled(isSubscribed);
      }
    };
    checkPushStatus();
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('todo_notifications') || '[]')
    setNotifications(savedNotifications.map(n => ({
      ...n,
      dueDate: n.dueDate ? new Date(n.dueDate) : null,
      createdAt: n.createdAt ? new Date(n.createdAt) : new Date()
    })))
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('todo_notifications', JSON.stringify(notifications))
  }, [notifications])

  // Check for due date notifications and schedule push notifications
  useEffect(() => {
    const now = new Date()
    const upcomingTasks = tasks.filter(task => 
      task.dueDate && 
      !task.completed &&
      isBefore(task.dueDate, addDays(now, 1)) &&
      !isBefore(task.dueDate, now)
    )

    const newNotifications = upcomingTasks.map(task => {
      const existingNotification = notifications.find(n => n.taskId === task.id)
      
      if (existingNotification) {
        // Update push notification if enabled
        if (pushEnabled) {
          pushNotificationService.scheduleTodoNotification(task);
        }
        return existingNotification;
      }

      // Schedule push notification for new due task
      if (pushEnabled) {
        pushNotificationService.scheduleTodoNotification(task);
      }

      return {
        id: Date.now() + Math.random(),
        taskId: task.id,
        taskText: task.text,
        dueDate: task.dueDate,
        message: `Task "${task.text}" is due ${isToday(task.dueDate) ? 'today' : 'tomorrow'}`,
        type: 'due_date',
        read: false,
        createdAt: new Date()
      }
    })

    // Filter out notifications for tasks that are completed or no longer exist
    const validTaskIds = new Set(tasks.map(task => task.id))
    const filteredNotifications = [...newNotifications].filter(notification => 
      validTaskIds.has(notification.taskId) && 
      !tasks.find(task => task.id === notification.taskId)?.completed
    )

    // Cancel push notifications for removed or completed tasks
    tasks.forEach(task => {
      if (task.completed || !validTaskIds.has(task.id)) {
        pushNotificationService.cancelScheduledNotification(task.id);
      }
    });

    setNotifications(prev => {
      // Keep only valid notifications
      const keptNotifications = prev.filter(n => 
        filteredNotifications.find(fn => fn.id === n.id) || 
        validTaskIds.has(n.taskId)
      )
      
      // Add new notifications
      const existingIds = new Set(keptNotifications.map(n => n.id))
      const uniqueNew = filteredNotifications.filter(n => !existingIds.has(n.id))
      
      return [...keptNotifications, ...uniqueNew]
    })
  }, [tasks, pushEnabled])

  // Toggle push notifications
  const togglePushNotifications = async () => {
    if (!pushNotificationService.checkSupport()) {
      alert('Push notifications are not supported in your browser');
      return;
    }

    try {
      if (pushEnabled) {
        await pushNotificationService.unsubscribe();
        setPushEnabled(false);
        // Cancel all scheduled notifications
        pushNotificationService.cancelAllScheduledNotifications();
      } else {
        await pushNotificationService.subscribe();
        setPushEnabled(true);
        // Reschedule notifications for current tasks
        tasks.forEach(task => {
          if (task.dueDate && !task.completed) {
            pushNotificationService.scheduleTodoNotification(task);
          }
        });
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      alert('Failed to toggle push notifications. Please check your browser settings.');
    }
  };

  const removeNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      pushNotificationService.cancelScheduledNotification(notification.taskId);
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const markAsUnread = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: false } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAllNotifications = () => {
    pushNotificationService.cancelAllScheduledNotifications();
    setNotifications([]);
  }

  return {
    notifications,
    pushEnabled,
    pushSupported: pushNotificationService.checkSupport(),
    togglePushNotifications,
    removeNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAllNotifications
  }
}