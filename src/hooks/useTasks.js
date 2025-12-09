import { useState, useEffect } from 'react'
import { loadTasks, saveTasks, addTask, toggleTask, deleteTask, updateTaskSubTasks, toggleSubTask } from '../utils/storage'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Load tasks on component mount
    setTasks(loadTasks())
  }, [])

  const handleAddTask = (text, dueDate, subTasks) => {
    const newTask = addTask(text, dueDate, subTasks)
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

  const handleUpdateSubTasks = (taskId, subTasks) => {
    const updatedTasks = updateTaskSubTasks(taskId, subTasks)
    setTasks(updatedTasks)
  }

  const handleToggleSubTask = (taskId, subTaskIndex) => {
    const updatedTasks = toggleSubTask(taskId, subTaskIndex)
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
    updateTaskSubTasks: handleUpdateSubTasks,
    toggleSubTask: handleToggleSubTask,
    clearAllTasks
  }
}