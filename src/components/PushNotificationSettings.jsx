import React, { useState } from 'react'
import { Bell, BellOff, AlertCircle, CheckCircle } from 'lucide-react'

const PushNotificationSettings = ({ 
  pushEnabled, 
  pushSupported, 
  onTogglePush
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onTogglePush();
    } catch (error) {
      console.error('Error toggling push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pushSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <span>Push notifications are not supported in your browser</span>
        </div>
      </div>
    );
  }

  const permission = Notification.permission;
  
  if (permission === 'denied') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Notifications are blocked</p>
            <p className="text-sm mt-1">Please enable notifications in your browser settings to receive push notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${pushEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            {pushEnabled ? (
              <Bell className="w-6 h-6 text-green-600" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-500">
              {pushEnabled 
                ? 'Receive notifications even when app is closed'
                : 'Enable to get notifications on your device'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            disabled={isLoading || permission === 'denied'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              pushEnabled ? 'bg-green-500' : 'bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pushEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {pushEnabled && (
        <>
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Push notifications are enabled</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>You'll receive notifications for:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Tasks due in 1 hour</li>
              <li>Tasks due now</li>
              <li>Click notifications to mark tasks complete</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PushNotificationSettings;