import React, { useState, useRef, useEffect } from 'react'
import { Bell, BellOff, CheckCircle, Circle, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

const NotificationBell = ({ 
  notifications, 
  unreadCount, 
  onRemoveNotification, 
  onMarkAsRead, 
  onMarkAsUnread,
  onCompleteTodo 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Listen for messages from service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'COMPLETE_TODO') {
          // Handle todo completion from push notification
          if (onCompleteTodo) {
            onCompleteTodo(event.data.todoId);
          }
          
          // Show a confirmation in the notifications list
          const taskId = event.data.todoId;
          const taskName = `Task #${taskId}`;
          
          const newNotification = {
            id: Date.now(),
            taskId: taskId,
            taskText: taskName,
            message: `Task completed via notification!`,
            type: 'push_action',
            read: false,
            createdAt: new Date()
          };
          
          // You might want to add this to your notifications state
          // This would require updating your useNotifications hook
        }
      });
    }
  }, [onCompleteTodo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        onMarkAsRead(notification.id)
      }
    })
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      notifications.forEach(notification => {
        onRemoveNotification(notification.id)
      })
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  // Categorize notifications by type
  const dueNotifications = notifications.filter(n => n.type === 'due_date');
  const pushNotifications = notifications.filter(n => n.type === 'push_action');

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-100 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-regular text-gray-800 dark:text-gray-100">
                Notifications
              </h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <BellOff className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
                <p className="text-sm mt-1 text-gray-400">
                  Enable push notifications to get reminders
                </p>
              </div>
            ) : (
              <>
                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                  <div className="border-b">
                    <div className="px-4 py-2 bg-blue-50 dark:bg-gray-800">
                      <span className="text-xs font-medium text-blue-700">NEW</span>
                    </div>
                    {unreadNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 border-b"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                {notification.message}
                              </p>
                              {notification.type === 'push_action' && (
                                <ExternalLink className="w-3 h-3 ml-1 text-blue-500" />
                              )}
                            </div>
                            {notification.dueDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Due: {format(notification.dueDate, 'MMM dd, yyyy HH:mm')}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-gray-400 hover:text-green-500 p-1"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveNotification(notification.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Read Notifications */}
                {readNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">READ</span>
                    </div>
                    {readNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 border-b"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                              {notification.type === 'push_action' && (
                                <ExternalLink className="w-3 h-3 ml-1 text-blue-500" />
                              )}
                            </div>
                            {notification.dueDate && (
                              <p className="text-xs text-gray-400 mt-1">
                                Due: {format(notification.dueDate, 'MMM dd, yyyy HH:mm')}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => onMarkAsUnread(notification.id)}
                              className="text-gray-400 hover:text-blue-500 p-1"
                              title="Mark as unread"
                            >
                              <Circle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemoveNotification(notification.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-100"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell