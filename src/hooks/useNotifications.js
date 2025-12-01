import { useState, useEffect } from 'react'
import { addDays, isBefore, isToday, isTomorrow } from 'date-fns'

export const useNotifications = (tasks) => {
  const [notifications, setNotifications] = useState([])

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

  // Check for due date notifications
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
        return existingNotification // Keep existing notification
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
  }, [tasks])

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
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
    setNotifications([])
  }

  return {
    notifications,
    removeNotification,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    clearAllNotifications
  }
}