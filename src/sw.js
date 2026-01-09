// src/sw.js

import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { clientsClaim } from 'workbox-core'

// Self.__WB_MANIFEST is automatically injected by Vite PWA plugin
const manifest = self.__WB_MANIFEST

// Precache all assets from the manifest
precacheAndRoute(manifest)

// Clean old caches
cleanupOutdatedCaches()

// Claim clients immediately
clientsClaim()

// Navigation route for SPA - ensures all navigation requests go to index.html
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler)
registerRoute(navigationRoute)

// ========== PUSH NOTIFICATION HANDLING ==========

// Listen for push events
self.addEventListener('push', function(event) {
  console.log('Push event received:', event)
  
  if (!event.data) {
    console.log('Push event but no data')
    return
  }
  
  let data
  try {
    data = event.data.json()
  } catch (e) {
    console.log('Push data not JSON, using text:', e)
    data = {
      title: 'TODOitApp',
      body: event.data.text() || 'You have a new notification',
      icon: '/icons/todoapp_192x192.png',
      badge: '/icons/todoapp_192x192.png'
    }
  }
  
  const options = {
    body: data.body || 'You have a new notification from TODOitApp',
    icon: data.icon || '/icons/todoapp_192x192.png',
    badge: data.badge || '/icons/todoapp_192x192.png',
    tag: data.tag || 'todo-notification',
    data: data.data || {},
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: data.actions || [
      {
        action: 'complete',
        title: '✅ Mark Complete'
      },
      {
        action: 'snooze',
        title: '⏰ Snooze 1 hour'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TODOitApp', options)
  )
})

// Listen for notification click events
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event.action)
  event.notification.close()
  
  // Handle action buttons
  if (event.action === 'complete') {
    // Send message to client to mark todo as complete
    event.waitUntil(
      self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: true 
      }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            client.postMessage({
              type: 'COMPLETE_TODO',
              todoId: event.notification.data.todoId
            })
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/')
        }
      })
    )
  } else if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: true 
      }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            client.postMessage({
              type: 'SNOOZE_TODO',
              todoId: event.notification.data.todoId,
              hours: 1
            })
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/')
        }
      })
    )
  } else {
    // Default click behavior - focus or open app
    event.waitUntil(
      self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: true 
      }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/')
        }
      })
    )
  }
})

// Listen for messages from the main app
self.addEventListener('message', function(event) {
  console.log('Service worker received message:', event.data)
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    // Schedule a notification for a todo
    const { todo, delay } = event.data
    
    console.log('Scheduling notification for todo:', todo.id, 'in', delay, 'ms')
    
    setTimeout(() => {
      self.registration.showNotification(`⏰ "${todo.text}" is due!`, {
        body: 'Complete your task now!',
        icon: '/icons/todoapp_192x192.png',
        badge: '/icons/todoapp_192x192.png',
        tag: `todo-${todo.id}`,
        data: {
          todoId: todo.id,
          url: window.location.origin
        },
        actions: [
          {
            action: 'complete',
            title: '✅ Mark Complete'
          },
          {
            action: 'snooze',
            title: '⏰ Snooze 1 hour'
          }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200]
      })
    }, delay)
  }
})

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed:', event)
  event.waitUntil(
    self.registration.pushManager.getSubscription().then(function(subscription) {
      if (subscription) {
        console.log('Subscription updated:', subscription)
        // Here you could send the new subscription to your server
      }
    })
  )
})

// Listen for install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  // Skip waiting so the new service worker activates immediately
  self.skipWaiting()
})

// Listen for activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  // Claim clients so the service worker controls pages immediately
  event.waitUntil(clientsClaim())
})