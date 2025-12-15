import React, { useState } from 'react'
import { Download, Upload, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx' // Import the xlsx library

const ExportImport = ({ onExport, onImport }) => {
  const [importError, setImportError] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImportError('')
    setIsImporting(true)
    
    try {
      const result = await onImport(file)
      if (result.success) {
        alert(result.message)
      } else {
        setImportError(result.message)
      }
    } catch (error) {
      setImportError('Error importing file: ' + error.message)
    } finally {
      setIsImporting(false)
      event.target.value = '' 
    }
  }

  const exportToExcel = () => {
    // Get tasks from localStorage using the correct key
    const tasksData = localStorage.getItem('todo_app_tasks')
    if (!tasksData) {
      alert('No tasks found to export')
      return
    }

    try {
      const tasks = JSON.parse(tasksData)
      
      if (tasks.length === 0) {
        alert('No tasks found to export')
        return
      }

      // Format tasks for Excel export with proper date formatting
      const formattedTasks = tasks.map(task => {
        // Helper function to format dates for Excel
        const formatExcelDate = (dateString) => {
          if (!dateString) return 'No date'
          const date = new Date(dateString)
          // Return as string with time for Excel
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        // Get completed sub-task names instead of indices
        const getCompletedSubTaskNames = () => {
          if (!task.completedSubTasks || !task.subTasks || task.completedSubTasks.length === 0) {
            return ''
          }
          
          return task.completedSubTasks
            .map(index => {
              // Handle both string and number indices
              const idx = typeof index === 'string' ? parseInt(index, 10) : index
              return task.subTasks[idx] || `Sub-task ${idx}`
            })
            .filter(name => name && name.trim() !== '')
            .join(', ')
        }

        // Get all sub-task names
        const getAllSubTaskNames = () => {
          if (!task.subTasks || task.subTasks.length === 0) {
            return ''
          }
          return task.subTasks.filter(st => st && st.trim() !== '').join(', ')
        }

        return {
          'Task ID': task.id || '',
          'Task Name': task.text || '',
          'Status': task.completed ? 'Completed' : 'Pending',
          'Due Date': formatExcelDate(task.dueDate),
          'Remarks': task.remarks || '',
          'Sub Tasks': getAllSubTaskNames(),
          'Completed Sub Tasks': getCompletedSubTaskNames(), // Now shows names instead of indices
          'Created Date': formatExcelDate(task.createdAt)
        }
      })

      // Create a new workbook
      const workbook = XLSX.utils.book_new()
      
      // Create worksheet from formatted data
      const worksheet = XLSX.utils.json_to_sheet(formattedTasks)
      
      // Auto-size columns for Tasks sheet
      const autoSizeColumns = (data, minWidth = 10, maxWidth = 50) => {
        if (!data || data.length === 0) return []
        
        const headers = Object.keys(data[0])
        const colWidths = []
        
        headers.forEach((header, colIndex) => {
          let maxLength = header.length
          
          data.forEach(row => {
            const cellValue = row[header] || ''
            const cellLength = String(cellValue).length
            if (cellLength > maxLength) {
              maxLength = cellLength
            }
          })
          
          // Set width with limits
          const width = Math.min(maxWidth, Math.max(minWidth, maxLength + 2))
          colWidths.push({ wch: width })
        })
        
        return colWidths
      }
      
      // Apply auto-sizing to Tasks sheet
      worksheet['!cols'] = autoSizeColumns(formattedTasks)
      
      // Add metadata sheet with better formatting
      const metadataData = [
        ['TODOit - Task Export Report'],
        [''],
        ['Export Information', ''],
        ['Export Date:', new Date().toLocaleString()],
        ['Total Tasks:', tasks.length],
        ['Completed Tasks:', tasks.filter(t => t.completed).length],
        ['Pending Tasks:', tasks.filter(t => !t.completed).length],
        [''],
        ['Application Information', ''],
        ['Application Name:', 'TODOit'],
        ['Application Version:', '1.0.7'],
        ['Export Format:', 'Excel (.xlsx)'],
        [''],
        ['File Information', ''],
        ['Generated:', new Date().toLocaleString()],
        ['File Name:', `todo-tasks-${new Date().toISOString().split('T')[0]}.xlsx`]
      ]
      
      const metadataWs = XLSX.utils.aoa_to_sheet(metadataData)
      
      // Auto-size metadata sheet columns
      const metadataColWidths = []
      
      // Calculate max width for first column (labels)
      let maxLabelWidth = 0
      metadataData.forEach(row => {
        if (row[0] && String(row[0]).length > maxLabelWidth) {
          maxLabelWidth = String(row[0]).length
        }
      })
      
      // Calculate max width for second column (values)
      let maxValueWidth = 0
      metadataData.forEach(row => {
        if (row[1] && String(row[1]).length > maxValueWidth) {
          maxValueWidth = String(row[1]).length
        }
      })
      
      // Apply widths to metadata sheet (limit to max 40 chars)
      metadataColWidths.push({ wch: Math.min(40, Math.max(15, maxLabelWidth + 2)) })
      metadataColWidths.push({ wch: Math.min(40, Math.max(15, maxValueWidth + 2)) })
      
      metadataWs['!cols'] = metadataColWidths
      
      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks')
      XLSX.utils.book_append_sheet(workbook, metadataWs, 'Metadata')
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0]
      const fileName = `todo-tasks-${dateStr}.xlsx`
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, fileName)
      
      console.log('Excel file exported successfully:', fileName)
      
    } catch (error) {
      alert('Error exporting to Excel: ' + error.message)
      console.error('Excel export error:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Data Management</h2>
      <div className="space-y-4">
        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <label className={`flex-1 flex items-center justify-center bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer ${isImporting ? 'opacity-50' : ''}`}>
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import'}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
            </label>
          </div>
          
          {/* New Excel Export Button */}
          <button
            onClick={exportToExcel}
            className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Save as Excel
          </button>
        </div>
        
        {/* Error message */}
        {importError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{importError}</p>
          </div>
        )}
        
        {/* Description */}
        <div className="text-sm text-gray-600">
          <p className="mb-1">• Export tasks as JSON for backup</p>
          <p className="mb-1">• Import previously exported JSON tasks</p>
          <p>• Save as Excel (.xlsx) with formatted dates and metadata</p>
        </div>
      </div>
    </div>
  )
}

export default ExportImport