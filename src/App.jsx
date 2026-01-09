import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from './hooks/useTasks'
import { useNotifications } from './hooks/useNotifications'
import { exportTasks, importTasks } from './utils/storage'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'
import NotificationBell from './components/NotificationBell'
import ExportImport from './components/ExportImport'
import ThemeToggle from './components/ThemeToggle'
import PushNotificationSettings from './components/PushNotificationSettings'
import './index.css'

const App = () => {
  // Make sure toggleSubTask is destructured from useTasks
  const { tasks, addTask, toggleTask, deleteTask, updateTaskSubTasks, toggleSubTask, updateTaskRemarks, updateTaskDueDate } = useTasks()
  const { 
    notifications, 
    pushEnabled, 
    pushSupported, 
    togglePushNotifications,
    removeNotification, 
    markAsRead, 
    markAsUnread,
    markAllAsRead,
    clearAllNotifications
  } = useNotifications(tasks)
  
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [showPushSettings, setShowPushSettings] = useState(false)

  useEffect(() => {
    // Filter unread notifications
    setUnreadNotifications(notifications.filter(n => !n.read))
  }, [notifications])

  // Listen for messages from service worker for push notification actions
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const handleServiceWorkerMessage = (event) => {
        if (event.data && event.data.type === 'COMPLETE_TODO') {
          // Complete the todo from push notification
          toggleTask(event.data.todoId);
          
          // Add a notification about the completion
          const completedTask = tasks.find(t => t.id === event.data.todoId);
          if (completedTask) {
            // Show a toast or notification (you can add a toast system here)
            console.log(`Task "${completedTask.text}" completed via push notification`);
          }
        }
        
        if (event.data && event.data.type === 'SNOOZE_TODO') {
          // Snooze the todo for 1 hour
          const task = tasks.find(t => t.id === event.data.todoId);
          if (task && task.dueDate) {
            const newDueDate = new Date(task.dueDate);
            newDueDate.setHours(newDueDate.getHours() + 1);
            updateTaskDueDate(event.data.todoId, newDueDate);
            
            // Show notification
            console.log(`Task "${task.text}" snoozed for 1 hour`);
          }
        }
      };

      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [tasks, toggleTask, updateTaskDueDate]);

  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  const handleImport = async (file) => {
    try {
      await importTasks(file)
      window.location.reload()
      return { success: true, message: 'Tasks imported successfully!' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              TO<span className="text-blue-500 dark:text-blue-400">DOit</span>
            </h1>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 mx-3">
                {tasks.length} tasks • {pendingTasks.length} pending
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadNotifications.length}
                  onRemoveNotification={removeNotification}
                  onMarkAsRead={markAsRead}
                  onMarkAsUnread={markAsUnread}
                  onCompleteTodo={toggleTask}
                  onMarkAllAsRead={markAllAsRead}
                  onClearAll={clearAllNotifications}
                />
                
                {/* Push Notification Settings Toggle */}
                <button
                  onClick={() => setShowPushSettings(!showPushSettings)}
                  className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-100 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Push Notification Settings"
                  title="Push Notification Settings"
                >
                  <svg 
                    className={`w-5 h-5 ${pushEnabled ? 'text-green-500' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Push Notification Settings Panel */}
        {showPushSettings && (
          <div className="mb-8 animate-fadeIn">
            <PushNotificationSettings
              pushEnabled={pushEnabled}
              pushSupported={pushSupported}
              onTogglePush={togglePushNotifications}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Adding Task Area & Export/Import */}
          <div className="lg:col-span-1 space-y-6">
            <AddTaskForm onAddTask={addTask} />
            <ExportImport 
              onExport={exportTasks} 
              onImport={handleImport} 
            />
            
            {/* Push Notification Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Push Notifications
                </h3>
                <button
                  onClick={() => setShowPushSettings(!showPushSettings)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                >
                  {showPushSettings ? 'Hide' : 'Settings'}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {pushEnabled 
                  ? '✓ You will receive device notifications for due tasks'
                  : 'Get notified on your device when tasks are due'}
              </p>
              
              {!pushEnabled && pushSupported && (
                <button
                  onClick={() => {
                    setShowPushSettings(true);
                    togglePushNotifications();
                  }}
                  className="w-full mt-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium transition-colors"
                >
                  Enable Push Notifications
                </button>
              )}
              
              {!pushSupported && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                  ⚠️ Push notifications are not supported in your current browser
                </p>
              )}
            </div>
          </div>

          {/* Right Columns - Tasks */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskList
                title={`Pending Tasks (${pendingTasks.length})`}
                tasks={pendingTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateSubtask={updateTaskSubTasks}
                onToggleSubTask={toggleSubTask}
                onUpdateRemarks={updateTaskRemarks}
                onUpdateDueDate={updateTaskDueDate}
                emptyMessage="No pending tasks"
              />
              
              <TaskList
                title={`Completed Tasks (${completedTasks.length})`}
                tasks={completedTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateSubtask={updateTaskSubTasks}
                onToggleSubTask={toggleSubTask}
                onUpdateRemarks={updateTaskRemarks}
                onUpdateDueDate={updateTaskDueDate}
                emptyMessage="No completed tasks yet"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t dark:border-gray-700 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                © 2025 Carlo Dandan. All Rights Reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                TODOit™ is a trademark of Carlo Dandan
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link 
                to="/privacy" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link 
                to="/terms" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Terms of Use
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link 
                to="/support" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Support
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link 
                to="/license" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                License Agreement
              </Link>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 dark:text-gray-300 text-xs">
                Version 1.0.8 • TODOitApp
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-xs mt-1">
                For support: carlodandan.personal@proton.me
              </p>
            </div>
          </div>
          
          {/* Push Notification Compliance Notice */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-300 text-xs text-center mb-2">
              This app uses push notifications to remind you of due tasks. Notifications are only sent for tasks you create and can be disabled at any time in settings.
            </p>
            
            {/* Microsoft Store Compliance Notice */}
            <p className="text-gray-500 dark:text-gray-300 text-xs text-center">
              This application is published in the Microsoft Store. Microsoft and the Microsoft Store logo are trademarks of Microsoft Corporation. 
              This application is not affiliated with, sponsored by, or endorsed by Microsoft Corporation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App