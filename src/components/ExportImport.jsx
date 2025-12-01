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
    <div className="mb-6">
      {/* Centered container */}
      <div className="flex flex-col items-center">
        {/* Buttons container - centered horizontally */}
        <div className="flex gap-4 mb-2 justify-center">
          <button
            onClick={onExport}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Tasks
          </button>
          
          <label className={`flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer shadow-sm ${isImporting ? 'opacity-50' : ''}`}>
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
        
        {/* Error message - centered */}
        {importError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md text-center">
            <p className="text-red-800 text-sm">{importError}</p>
          </div>
        )}
        
        {/* Description text - centered */}
        <div className="text-xs text-gray-500 text-center mt-2 max-w-md">
          Export your tasks as a JSON file for backup or import previously exported tasks.
        </div>
      </div>
    </div>
  )
}

export default ExportImport