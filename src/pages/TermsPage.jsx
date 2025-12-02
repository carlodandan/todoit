import React from 'react'
import { Link } from 'react-router-dom'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
              TO<span className="text-blue-500">DOit</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Use</h1>
          <p className="text-gray-500 mb-8"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. License Grant</h2>
              <p>Carlo Dandan grants you a personal, non-exclusive, non-transferable license to use TODOit for personal or business purposes.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Restrictions</h2>
              <p>You may not reverse engineer, decompile, or disassemble the software. The application is provided "as is" without warranty.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Data Responsibility</h2>
              <p>You are responsible for backing up your data using the export feature. The developer is not liable for data loss due to browser clearing or device issues.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Microsoft Store</h2>
              <p>This application is distributed through Microsoft Store. Microsoft Corporation is not responsible for the application's functionality or content.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Governing Law</h2>
              <p>This agreement is governed by the laws of [Your Country/State]. Any disputes shall be resolved in [Your Jurisdiction] courts.</p>
            </section>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TermsPage