// Helper to transform task dates
const transformTaskDates = (task) => ({
  id: task.id,
  text: task.text,
  completed: Boolean(task.completed),
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  remarks: task.remarks || '',
  createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
})

// Generate unique ID
const generateId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const loadTasks = () => {
  try {
    const tasks = JSON.parse(localStorage.getItem('todo_app_tasks') || '[]')
    return tasks.map(transformTaskDates)
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error)
    return []
  }
}

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem('todo_app_tasks', JSON.stringify(tasks))
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error)
  }
}

export const addTask = (text, dueDate = null, remarks = '') => {
  if (!text.trim()) return null

  const tasks = loadTasks()
  const newTask = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    dueDate: dueDate ? new Date(dueDate) : null,
    remarks: remarks,
    createdAt: new Date()
  }

  const updatedTasks = [...tasks, newTask]
  saveTasks(updatedTasks)
  return newTask
}

export const toggleTask = (taskId) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.map(task =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  )
  saveTasks(updatedTasks)
  return updatedTasks
}

export const deleteTask = (taskId) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.filter(task => task.id !== taskId)
  saveTasks(updatedTasks)
  return updatedTasks
}

export const updateTaskRemarks = (taskId, remarks) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.map(task =>
    task.id === taskId ? { ...task, remarks } : task
  )
  saveTasks(updatedTasks)
  return updatedTasks
}

export const exportTasks = () => {
  const tasks = loadTasks()
  const data = {
    tasks: tasks,
    exportedAt: new Date().toISOString(),
    version: '1.0',
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.completed).length
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `todo-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const importTasks = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (!data.tasks || !Array.isArray(data.tasks)) {
          reject(new Error('Invalid file format: tasks array not found'))
          return
        }

        // Validate and transform imported tasks
        const transformedTasks = data.tasks.map(task => ({
          id: task.id || generateId(),
          text: task.text || 'Untitled Task',
          completed: Boolean(task.completed),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          remarks: task.remarks || '',
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
        }))

        // Replace current tasks with imported ones
        saveTasks(transformedTasks)
        resolve(transformedTasks)
      } catch (error) {
        reject(new Error('Error parsing JSON file: ' + error.message))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsText(file)
  })
}

// Utility functions
export const clearAllTasks = () => {
  localStorage.removeItem('todo_app_tasks')
}

export const getTaskStats = () => {
  const tasks = loadTasks()
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length
  }
}