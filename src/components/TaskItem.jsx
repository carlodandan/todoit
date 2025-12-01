import React, { useState } from 'react'
import { CheckCircle, Circle, Calendar, Trash2, MessageSquare, Edit } from 'lucide-react'
import { format, isBefore, isToday, isTomorrow } from 'date-fns'

const TaskItem = ({ task, onToggle, onDelete, onUpdateRemarks }) => {
  const [showRemarks, setShowRemarks] = useState(false)
  const [editingRemarks, setEditingRemarks] = useState(false)
  const [remarksText, setRemarksText] = useState(task.remarks || '')

  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-gray-500'
    const now = new Date()
    if (isBefore(task.dueDate, now)) return 'text-red-500'
    if (isToday(task.dueDate)) return 'text-orange-500'
    if (isTomorrow(task.dueDate)) return 'text-yellow-500'
    return 'text-green-500'
  }

  const handleRemarksSave = () => {
    onUpdateRemarks(task.id, remarksText)
    setEditingRemarks(false)
    setShowRemarks(true)
  }

  const handleRemarksCancel = () => {
    setRemarksText(task.remarks || '')
    setEditingRemarks(false)
  }

  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in">
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          className="flex-shrink-0 text-gray-400 hover:text-green-500 transition-colors"
        >
          {task.completed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.text}
          </p>
          
          {task.dueDate && (
            <div className="flex items-center mt-1">
              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
              <span className={`text-xs ${getDueDateColor()}`}>
                Due: {format(task.dueDate, 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          )}

          {task.remarks && !editingRemarks && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <strong>Note:</strong> {task.remarks}
            </div>
          )}

          {editingRemarks && (
            <div className="mt-2 space-y-2">
              <textarea
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                placeholder="Add remarks..."
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleRemarksSave}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleRemarksCancel}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {!editingRemarks && (
          <button
            onClick={() => {
              if (task.remarks) {
                setShowRemarks(!showRemarks)
              } else {
                setEditingRemarks(true)
              }
            }}
            className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1"
            title={task.remarks ? 'View remarks' : 'Add remarks'}
          >
            {task.remarks ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
              <Edit className="w-4 h-4" />
            )}
          </button>
        )}
        
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TaskItem