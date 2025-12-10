import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-gray-600">
              TO<span className="text-blue-500 dark:text-blue-400">DOit</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Data Collection</h2>
              <p>TODOit does not collect, transmit, or share any personal information. All data is stored locally on your device using browser localStorage.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Data Storage</h2>
              <p>All tasks, due dates, remarks, and application settings are stored exclusively on your device. No data is sent to external servers or third parties.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Microsoft Store Compliance</h2>
              <p>This application complies with Microsoft Store policies for Windows applications. The application:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Does not collect user data</li>
                <li>Functions without internet connectivity</li>
                <li>Does not require Microsoft account login</li>
                <li>Provides clear data handling information</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Contact Information</h2>
              <p>For questions about this privacy policy, contact: carlodandan.personal@proton.me</p>
            </section>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PrivacyPage