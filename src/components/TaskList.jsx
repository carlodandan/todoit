import React from 'react'
import TaskItem from './TaskItem'

const TaskList = ({ 
  title, 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onUpdateSubtask, 
  onToggleSubTask, 
  onUpdateRemarks, // Add this prop
  emptyMessage 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
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