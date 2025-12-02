import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTasks } from './hooks/useTasks'
import { useNotifications } from './hooks/useNotifications'
import { exportTasks, importTasks } from './utils/storage'
import AddTaskForm from './components/AddTaskForm'
import TaskList from './components/TaskList'
import NotificationBell from './components/NotificationBell'
import ExportImport from './components/ExportImport'
import './index.css'

const App = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTaskRemarks } = useTasks()
  const { notifications, removeNotification, markAsRead, markAsUnread } = useNotifications(tasks)
  
  const [unreadNotifications, setUnreadNotifications] = useState([])

  useEffect(() => {
    // Filter unread notifications
    setUnreadNotifications(notifications.filter(n => !n.read))
  }, [notifications])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">TO<span className="text-blue-500">DOit</span></h1>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                {tasks.length} tasks • {pendingTasks.length} pending
              </div>
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadNotifications.length}
                onRemoveNotification={removeNotification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Adding Task Area & Export/Import */}
          <div className="lg:col-span-1 space-y-6">
            <AddTaskForm onAddTask={addTask} />
            <ExportImport 
              onExport={exportTasks} 
              onImport={handleImport} 
            />
          </div>

          {/* Right Columns - Tasks */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskList
                title={`Pending Tasks (${pendingTasks.length})`}
                tasks={pendingTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateRemarks={updateTaskRemarks}
                emptyMessage="No pending tasks"
              />
              
              <TaskList
                title={`Completed Tasks (${completedTasks.length})`}
                tasks={completedTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateRemarks={updateTaskRemarks}
                emptyMessage="No completed tasks yet"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-sm">
                © 2025 Carlo Dandan. All Rights Reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                TODOit™ is a trademark of Carlo Dandan
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link 
                to="/privacy" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/terms" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Terms of Use
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/support" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Support
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/license" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                License Agreement
              </Link>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-xs">
                Version 1.0.0 • Local Storage Application
              </p>
              <p className="text-gray-400 text-xs mt-1">
                For support: carlodandan.personal@proton.me
              </p>
            </div>
          </div>
          
          {/* Microsoft Store Compliance Notice */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs text-center">
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