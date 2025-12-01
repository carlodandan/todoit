import React, { useState } from 'react'
import { Download, Upload } from 'lucide-react'

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
      <div className="space-y-4">
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExport}
            className="flex-1 flex items-center justify-center bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Tasks
          </button>
          
          <label className={`flex-1 flex items-center justify-center bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer ${isImporting ? 'opacity-50' : ''}`}>
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import Tasks'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={isImporting}
            />
          </label>
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
          <p>• Import previously exported tasks</p>
        </div>
      </div>
    </div>
  )
}

export default ExportImport