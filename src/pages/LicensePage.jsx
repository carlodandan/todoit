import React from 'react'
import { Link } from 'react-router-dom'

const LicensePage = () => {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">License Agreement</h1>
          <p className="text-gray-500 mb-8"><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Software License</h2>
              <p>TODOit is licensed, not sold. Carlo Dandan grants you a revocable, non-exclusive, non-transferable license to use the software.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Usage Rights</h2>
              <p>You may use TODOit for personal or commercial purposes. You may not redistribute, sublicense, or modify the software without permission.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Intellectual Property</h2>
              <p>All intellectual property rights in TODOit remain with Carlo Dandan. The TODOit name and logo are trademarks of Carlo Dandan.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Termination</h2>
              <p>This license terminates automatically if you violate any terms. Upon termination, you must cease all use of the software.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. No Warranty</h2>
              <p>The software is provided "as is" without warranty of any kind. Carlo Dandan is not liable for any damages arising from the use of this software.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Responsibility</h2>
              <p>You are solely responsible for backing up your data. The developer is not liable for data loss due to browser clearing, device failure, or user error.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Updates</h2>
              <p>Carlo Dandan may update this license agreement. Continued use of TODOit after updates constitutes acceptance of the new terms.</p>
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

export default LicensePage