// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Bell, BellOff, CheckCircle, Circle, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'

const NotificationBell = ({ 
  notifications, 
  unreadCount, 
  onRemoveNotification, 
  onMarkAsRead, 
  onMarkAsUnread 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
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
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-regular text-gray-800">
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
              </div>
            ) : (
              <>
                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                  <div className="border-b">
                    <div className="px-4 py-2 bg-blue-50">
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
                              <p className="text-sm font-medium text-gray-800">
                                {notification.message}
                              </p>
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
                      <span className="text-xs font-medium text-gray-700">READ</span>
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
                className="text-sm text-gray-600 hover:text-gray-800"
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