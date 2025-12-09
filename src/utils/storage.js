// Helper to transform task dates
const transformTaskDates = (task) => ({
  id: task.id,
  text: task.text,
  completed: Boolean(task.completed),
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  subTasks: Array.isArray(task.subTasks) ? task.subTasks : (task.remarks ? [task.remarks] : []),
  completedSubTasks: Array.isArray(task.completedSubTasks) ? task.completedSubTasks : [],
  createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
})

// Helper to safely filter sub-tasks
const filterValidSubTasks = (subTasks) => {
  if (!Array.isArray(subTasks)) return []
  
  return subTasks.filter(st => {
    // Handle different types safely
    if (typeof st === 'string') {
      return st.trim() !== ''
    } else if (typeof st === 'number') {
      return String(st).trim() !== ''
    } else if (st === null || st === undefined) {
      return false
    }
    // For other types (objects, arrays), convert to string
    return String(st).trim() !== ''
  }).map(st => {
    // Convert all sub-tasks to strings
    if (typeof st === 'string') return st
    if (typeof st === 'number') return String(st)
    return String(st)
  })
}

// Generate unique ID
const generateId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const loadTasks = () => {
  try {
    const tasks = JSON.parse(localStorage.getItem('todo_app_tasks') || '[]')
    
    return tasks.map(task => {
      const transformed = transformTaskDates(task)
      
      // Ensure subTasks exists and is valid
      let subTasks = []
      if (Array.isArray(transformed.subTasks)) {
        subTasks = filterValidSubTasks(transformed.subTasks)
      } else if (transformed.subTasks && typeof transformed.subTasks === 'string') {
        subTasks = transformed.subTasks.trim() !== '' ? [transformed.subTasks] : []
      }
      
      return {
        ...transformed,
        subTasks: subTasks
      }
    })
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

export const addTask = (text, dueDate = null, subTasks = []) => {
  if (!text.trim()) return null

  const tasks = loadTasks()
  const newTask = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    dueDate: dueDate ? new Date(dueDate) : null,
    subTasks: filterValidSubTasks(subTasks),
    completedSubTasks: [],
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

export const toggleSubTask = (taskId, subTaskIndex) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      const completedSubTasks = task.completedSubTasks || []
      const isCurrentlyCompleted = completedSubTasks.includes(subTaskIndex)
      
      let newCompletedSubTasks
      if (isCurrentlyCompleted) {
        newCompletedSubTasks = completedSubTasks.filter(idx => idx !== subTaskIndex)
      } else {
        newCompletedSubTasks = [...completedSubTasks, subTaskIndex]
      }
      
      return {
        ...task,
        completedSubTasks: newCompletedSubTasks
      }
    }
    return task
  })
  
  saveTasks(updatedTasks)
  return updatedTasks
}

export const deleteTask = (taskId) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.filter(task => task.id !== taskId)
  saveTasks(updatedTasks)
  return updatedTasks
}

export const updateTaskSubTasks = (taskId, subTasks) => {
  const tasks = loadTasks()
  const updatedTasks = tasks.map(task =>
    task.id === taskId ? { 
      ...task, 
      subTasks: filterValidSubTasks(subTasks)
    } : task
  )
  saveTasks(updatedTasks)
  return updatedTasks
}

export const exportTasks = () => {
  const tasks = loadTasks()
  const data = {
    tasks: tasks,
    exportedAt: new Date().toISOString(),
    version: '1.1',
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

        const transformedTasks = data.tasks.map(task => ({
          id: task.id || generateId(),
          text: task.text || 'Untitled Task',
          completed: Boolean(task.completed),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          subTasks: filterValidSubTasks(task.subTasks || (task.remarks ? [task.remarks] : [])),
          completedSubTasks: Array.isArray(task.completedSubTasks) ? task.completedSubTasks : [],
          createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
        }))

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