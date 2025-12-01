import React, { useState, useEffect } from 'react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <main className="max-w-7xl mx-auto px-4 py-8">
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
    </div>
  )
}

export default App