import React, { useState, useEffect } from 'react'
import { CheckCircle, Circle, Calendar, Trash2, Edit, Plus, X, ChevronDown, ChevronRight, FileText, Save, XCircle } from 'lucide-react'
import { format, isBefore, isToday, isTomorrow } from 'date-fns'

const TaskItem = ({ task, onToggle, onDelete, onUpdateSubTasks, onToggleSubTask, onUpdateRemarks }) => { // Add onUpdateRemarks to props
  const [showSubTasks, setShowSubTasks] = useState(false)
  const [editingSubTasks, setEditingSubTasks] = useState(false)
  const [subTasks, setSubTasks] = useState(task.subTasks || [])
  const [newSubTask, setNewSubTask] = useState('')
  const [showRemarks, setShowRemarks] = useState(false)
  const [editingRemarks, setEditingRemarks] = useState(false)
  const [remarks, setRemarks] = useState(task.remarks || '')

  // Update subTasks when task.subTasks changes
  useEffect(() => {
    setSubTasks(task.subTasks || [])
  }, [task.subTasks])

  // Update remarks when task.remarks changes
  useEffect(() => {
    setRemarks(task.remarks || '')
  }, [task.remarks])

  const getDueDateColor = () => {
    if (!task.dueDate) return 'text-gray-500'
    const now = new Date()
    if (isBefore(task.dueDate, now)) return 'text-red-500'
    if (isToday(task.dueDate)) return 'text-orange-500'
    if (isTomorrow(task.dueDate)) return 'text-yellow-500'
    return 'text-green-500'
  }

  const handleSubTasksSave = () => {
    // Filter out empty sub-tasks and ensure we have valid data
    const filteredSubTasks = subTasks.filter(st => st && st.trim() !== '')
    
    // Call the update function which should save to localStorage
    onUpdateSubTasks(task.id, filteredSubTasks)
    
    // Reset editing state
    setEditingSubTasks(false)
    setShowSubTasks(true)
    setNewSubTask('')
  }

  const handleSubTasksCancel = () => {
    // Reset to original task sub-tasks
    setSubTasks(task.subTasks || [])
    setEditingSubTasks(false)
    setNewSubTask('')
  }

  const addNewSubTask = () => {
    if (newSubTask.trim()) {
      const updatedSubTasks = [...subTasks, newSubTask.trim()]
      setSubTasks(updatedSubTasks)
      setNewSubTask('')
    }
  }

  const removeSubTask = (index) => {
    const newSubTasks = [...subTasks]
    newSubTasks.splice(index, 1)
    setSubTasks(newSubTasks)
  }

  const updateSubTask = (index, value) => {
    const newSubTasks = [...subTasks]
    newSubTasks[index] = value
    setSubTasks(newSubTasks)
  }

  // Handle sub-task checkbox toggle
  const handleSubTaskToggle = (index) => {
    if (onToggleSubTask) {
      onToggleSubTask(task.id, index)
    }
  }

  // Check if a sub-task is completed
  const isSubTaskCompleted = (index) => {
    return task.completedSubTasks && task.completedSubTasks.includes(index)
  }

  // Handle remarks editing
  const handleEditRemarks = () => {
    setEditingRemarks(true)
    setShowRemarks(true)
  }

  const handleSaveRemarks = () => {
    // Call the update remarks function from props
    if (onUpdateRemarks) {
      onUpdateRemarks(task.id, remarks)
    }
    setEditingRemarks(false)
  }

  const handleCancelRemarks = () => {
    setRemarks(task.remarks || '')
    setEditingRemarks(false)
    if (!task.remarks || !task.remarks.trim()) {
      setShowRemarks(false)
    }
  }

  return (
    <div className="border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors animate-fade-in">
      {/* Main Task Row */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className="shrink-0 text-gray-400 hover:text-green-500 transition-colors"
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
            
            {/* Task metadata row */}
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {task.dueDate && (
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  <span className={`text-xs ${getDueDateColor()}`}>
                    Due: {format(task.dueDate, 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              )}
              
              {/* Remarks toggle/edit button */}
              <div className="flex items-center gap-1">
                {!editingRemarks && (
                  <button
                    onClick={() => {
                      if (task.remarks && task.remarks.trim()) {
                        setShowRemarks(!showRemarks)
                      } else {
                        handleEditRemarks()
                      }
                    }}
                    className="flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {task.remarks && task.remarks.trim() 
                      ? (showRemarks ? 'Hide Remarks' : 'Show Remarks')
                      : 'Add Remarks'
                    }
                  </button>
                )}
                
                {!editingRemarks && (
                  <button
                    onClick={handleEditRemarks}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-0.5"
                    title={task.remarks && task.remarks.trim() ? 'Edit Remarks' : 'Add Remarks'}
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {!editingSubTasks && task.subTasks && task.subTasks.length > 0 && (
            <button
              onClick={() => setShowSubTasks(!showSubTasks)}
              className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1"
              title={showSubTasks ? 'Hide sub-tasks' : 'Show sub-tasks'}
            >
              {showSubTasks ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          {!editingSubTasks && (
            <button
              onClick={() => {
                setEditingSubTasks(true)
                if (task.subTasks && task.subTasks.length === 0) {
                  setShowSubTasks(true)
                }
              }}
              className="flex-shrink-0 text-gray-400 hover:text-blue-500 transition-colors p-1"
              title={task.subTasks && task.subTasks.length > 0 ? 'Edit sub-tasks' : 'Add sub-tasks'}
            >
              <Edit className="w-4 h-4" />
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

      {/* Remarks Section */}
      {showRemarks && (
        <div className="border-t border-gray-100 bg-blue-50/50 p-3">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              
              {editingRemarks ? (
                // Edit mode for remarks
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-600 mb-1">Remarks:</p>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] resize-y"
                    placeholder="Add notes, comments, or additional information..."
                    rows="3"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={handleSaveRemarks}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelRemarks}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 flex items-center"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode for remarks
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-600 mb-1">Remarks:</p>
                  {task.remarks && task.remarks.trim() ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.remarks}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No remarks added yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tasks Section */}
      {(showSubTasks || editingSubTasks) && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-3">
          <div className="space-y-2">
            {!editingSubTasks && task.subTasks && task.subTasks.length > 0 ? (
              // View mode - show sub-tasks with checkboxes
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-1">Sub-tasks:</p>
                {task.subTasks.map((subTask, index) => (
                  <div key={index} className="flex items-center space-x-2 pl-6">
                    <button
                      onClick={() => handleSubTaskToggle(index)}
                      className="flex-shrink-0 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      {isSubTaskCompleted(index) ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs ${isSubTaskCompleted(index) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {subTask}
                    </span>
                  </div>
                ))}
              </div>
            ) : editingSubTasks ? (
              // Edit mode - edit sub-tasks
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {subTasks.length > 0 ? 'Edit sub-tasks:' : 'Add sub-tasks:'}
                </p>
                
                {/* Existing sub-tasks */}
                {subTasks.length > 0 && (
                  <div className="space-y-2">
                    {subTasks.map((subTask, index) => (
                      <div key={index} className="flex items-center gap-2 pl-6">
                        <input
                          type="text"
                          value={subTask}
                          onChange={(e) => updateSubTask(index, e.target.value)}
                          className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubTask(index)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new sub-task */}
                <div className="flex items-center gap-2 pl-6">
                  <input
                    type="text"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    placeholder={subTasks.length > 0 ? "Add new sub-task..." : "Enter sub-task..."}
                    className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addNewSubTask()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addNewSubTask}
                    className="text-blue-500 hover:text-blue-700 p-1"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleSubTasksSave}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleSubTasksCancel}
                    className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskItem