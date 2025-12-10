import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const SupportPage = () => {
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Support</h1>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Contact Information</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> carlodandan.personal@proton.me</p>
                <p className="mb-2"><strong>Response Time:</strong> Within 48 hours</p>
                <p><strong>Hours:</strong> Monday-Friday, 9AM-5PM</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Q: My tasks disappeared!</h3>
                  <p className="text-gray-600 dark:text-gray-400">A: Check if you cleared your browser data. Always use the Export feature for regular backups. Your data is stored in browser localStorage, which can be cleared by browser settings or cleanup tools.</p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Q: Notifications not working?</h3>
                  <p className="text-gray-600 dark:text-gray-400">A: Ensure your browser allows notifications. For due date notifications, keep the app open or refresh the page. Notifications are browser-based and may not work in some privacy modes.</p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Q: Can I sync across devices?</h3>
                  <p className="text-gray-600 dark:text-gray-400">A: Currently, TODOit is local-only for privacy. Use the Export feature to create a backup file, then Import it on another device to transfer your tasks.</p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Q: Is there a mobile app?</h3>
                  <p className="text-gray-600 dark:text-gray-400">A: TODOit is a web application that works on mobile browsers. You can add it to your home screen for an app-like experience.</p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Feature Requests</h2>
              <p>Have an idea for TODOit? We'd love to hear from you! Send your suggestions to the email above.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Bug Reports</h2>
              <p>Found a bug? Please email us with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Browser and version</li>
                <li>Steps to reproduce</li>
                <li>Screenshot if possible</li>
                <li>Expected vs actual behavior</li>
              </ul>
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

export default SupportPage