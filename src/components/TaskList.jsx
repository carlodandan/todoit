import React from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ 
  title, 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onUpdateSubtask, 
  onToggleSubTask, 
  onUpdateRemarks,
  onUpdateDueDate, // Add this prop
  emptyMessage 
}) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h2>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onUpdateSubTasks={onUpdateSubtask}
            onToggleSubTask={onToggleSubTask}
            onUpdateRemarks={onUpdateRemarks}
            onUpdateDueDate={onUpdateDueDate} // Pass the new prop
          />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
        )}
      </div>
    </div>
  )
}

export default TaskList