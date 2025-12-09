import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

const AddTaskForm = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [remarks, setRemarks] = useState('')
  const [subTasks, setSubTasks] = useState([''])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      // Filter out empty sub-tasks
      const filteredSubTasks = subTasks.filter(st => st.trim() !== '')
      onAddTask(newTask, dueDate, filteredSubTasks, remarks.trim())
      setNewTask('')
      setDueDate('')
      setRemarks('') // Add this line
      setSubTasks([''])
    }
  }

  const addSubTaskField = () => {
    setSubTasks([...subTasks, ''])
  }

    const removeSubTaskField = (index) => {
    if (subTasks.length > 1) {
      const newSubTasks = [...subTasks]
      newSubTasks.splice(index, 1)
      setSubTasks(newSubTasks)
    }
  }

  const updateSubTask = (index, value) => {
    const newSubTasks = [...subTasks]
    newSubTasks[index] = value
    setSubTasks(newSubTasks)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Task Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remarks (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add notes, comments, or additional information..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this for notes that are not part of sub-tasks.
            </p>
          </div>

          {/* Sub-Tasks - remaining code stays the same */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Sub-Tasks (Optional)
              </label>
              <button
                type="button"
                onClick={addSubTaskField}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                + Add More
              </button>
            </div>
            
            <div className="space-y-2">
              {subTasks.map((subTask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subTask}
                    onChange={(e) => updateSubTask(index, e.target.value)}
                    placeholder={`Sub-task ${index + 1}...`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {subTasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubTaskField(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTaskForm