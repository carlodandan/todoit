// src/components/AddTaskForm.jsx
import React, { useState } from 'react'
import { Plus } from 'lucide-react'

const AddTaskForm = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [remarks, setRemarks] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAddTask(newTask, dueDate, remarks)
      setNewTask('')
      setDueDate('')
      setRemarks('')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Task Input Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date and Remarks - Centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg w-full max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                  Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
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