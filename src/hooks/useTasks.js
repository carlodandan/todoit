// src/hooks/useTasks.js
import { useState, useEffect } from 'react'
import { loadTasks, saveTasks, addTask, toggleTask, deleteTask, updateTaskRemarks } from '../utils/storage'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Load tasks on component mount
    setTasks(loadTasks())
  }, [])

  const handleAddTask = (text, dueDate, remarks) => {
    const newTask = addTask(text, dueDate, remarks)
    if (newTask) {
      setTasks(prev => [...prev, newTask])
    }
  }

  const handleToggleTask = (taskId) => {
    const updatedTasks = toggleTask(taskId)
    setTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId) => {
    const updatedTasks = deleteTask(taskId)
    setTasks(updatedTasks)
  }

  const handleUpdateRemarks = (taskId, remarks) => {
    const updatedTasks = updateTaskRemarks(taskId, remarks)
    setTasks(updatedTasks)
  }

  const clearAllTasks = () => {
    saveTasks([])
    setTasks([])
  }

  return {
    tasks,
    addTask: handleAddTask,
    toggleTask: handleToggleTask,
    deleteTask: handleDeleteTask,
    updateTaskRemarks: handleUpdateRemarks,
    clearAllTasks
  }
}