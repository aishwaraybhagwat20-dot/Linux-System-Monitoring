/**
* Service Worker for PWA Capabilities
* Author: Member 4
*/
const CACHE
NAME =
_
const STATIC
CACHE =
_
const DYNAMIC
CACHE =
_
'system-monitor-v1.0.0';
'static-resources-v1';
'dynamic-content-v1';
const STATIC
_
FILES = [
'/'
,
'/static/css/app.css'
,
'/static/js/app.js'
,
'/static/js/charts.js'
,
'/static/images/icons/icon-192x192.png'
'/static/images/icons/icon-512x512.png'
'/offline.html'
,
,
];
const API
_
ENDPOINTS = [
'/api/v1/system/stats'
,
'/api/v1/processes'
,
'/api/v1/analytics/health'
];
// Install Service Worker
self.addEventListener('install'
, event =&gt; {
console.log('Service Worker: Installing...
');
event.waitUntil(
Promise.all([
// Cache static resources
caches.open(STATIC
_
CACHE).then(cache =&gt; {
console.log('Service Worker: Caching static files');
return cache.addAll(STATIC
_
FILES);
}),
// Skip waiting to activate immediately
self.skipWaiting()
])
);
});
// Activate Service Worker
self.addEventListener('activate'
, event =&gt; {
console.log('Service Worker: Activating...
');
event.waitUntil(
Promise.all([
// Clean up old caches
caches.keys().then(cacheNames =&gt; {
return Promise.all(
cacheNames.map(cacheName =&gt; {
if (cacheName !== STATIC
_
CACHE &amp;&amp;
cacheName !== DYNAMIC
_
CACHE &amp;&amp;
cacheName !== CACHE
_
NAME) {
console.log('Service Worker: Deleting old cache:'
, ca
return caches.delete(cacheName);
}
})
);
}),
// Take control of all clients
self.clients.claim()
])
);
});
// Fetch Strategy
self.addEventListener('fetch'
, event =&gt; {
const { request } = event;
const url = new URL(request.url);
// Handle API requests
if (url.pathname.startsWith('/api/')) {
event.respondWith(handleApiRequest(request));
}
// Handle static resources
else if (STATIC
_
FILES.some(file =&gt; url.pathname === file)) {
event.respondWith(handleStaticRequest(request));
}
// Handle other requests
else {
event.respondWith(handleDynamicRequest(request));
}
});
// API Request Handler (Network First, Cache Fallback)
async function handleApiRequest(request) {
try {
// Try network first
const networkResponse = await fetch(request);
if (networkResponse.ok) {
// Cache successful responses
const cache = await caches.open(DYNAMIC
_
CACHE);
cache.put(request, networkResponse.clone());
return networkResponse;
}
throw new Error('Network response not ok');
} catch (error) {
console.log('Service Worker: Network failed, trying cache for:'
// Fallback to cache
const cachedResponse = await caches.match(request);
if (cachedResponse) {
return cachedResponse;
}
, request
// Return offline response for specific endpoints
return createOfflineApiResponse(request);
}
}
// Static Request Handler (Cache First)
async function handleStaticRequest(request) {
const cachedResponse = await caches.match(request);
if (cachedResponse) {
return cachedResponse;
}
// If not in cache, fetch and cache
try {
const networkResponse = await fetch(request);
const cache = await caches.open(STATIC
_
CACHE);
cache.put(request, networkResponse.clone());
return networkResponse;
} catch (error) {
console.log('Service Worker: Failed to fetch static resource:'
return new Response('Resource not available offline'
, request.u
, { status: 404 });
}
}
// Dynamic Request Handler (Network First, Cache Fallback)
async function handleDynamicRequest(request) {
try {
const networkResponse = await fetch(request);
if (networkResponse.ok) {
const cache = await caches.open(DYNAMIC
_
CACHE);
cache.put(request, networkResponse.clone());
return networkResponse;
}
throw new Error('Network response not ok');
} catch (error) {
const cachedResponse = await caches.match(request);
if (cachedResponse) {
return cachedResponse;
}
// Return offline page for navigation requests
if (request.destination ===
'document') {
return caches.match('/offline.html');
}
return new Response('Content not available offline'
, { status: 404 });
}
}
// Create offline API responses with cached data
function createOfflineApiResponse(request) {
const url = new URL(request.url);
// Return mock data for system stats when offline
if (url.pathname.includes('/system/stats')) {
const mockData = {
cpu: { usage
_percent: 0, offline: true },
memory: { usage
_percent: 0, offline: true },
disk: { usage
_percent: 0, offline: true },
network: { sent
_
rate: 0, recv
_
rate: 0, offline: true },
timestamp: new Date().toISOString(),
offline
mode: true
_
};
return new Response(JSON.stringify(mockData), {
status: 200,
statusText: 'OK'
,
headers: {
'Content-Type': 'application/json'
,
'X-Offline-Response': 'true'
}
}
});
return new Response('Service temporarily unavailable'
, { status: 503 });
}
// Push Notification Handler
self.addEventListener('push'
, event =&gt; {
console.log('Service Worker: Push notification received');
if (!event.data) {
return;
}
const data = event.data.json();
const options = {
body: data.body || 'System Monitor Alert'
,
icon: '/static/images/icons/icon-192x192.png'
badge: '/static/images/icons/badge-72x72.png'
tag: data.tag || 'system-alert'
,
data: data.data || {},
actions: [
{
,
,
action: 'view'
,
title: 'View Dashboard'
,
icon: '/static/images/icons/action-view.png'
},
{
action: 'dismiss'
,
title: 'Dismiss'
,
icon: '/static/images/icons/action-dismiss.png'
}
],
vibrate: [100, 50, 100],
requireInteraction: data.priority ===
'high'
};
event.waitUntil(
self.registration.showNotification(data.title || 'System Monitor'
, option
);
});
// Notification Click Handler
self.addEventListener('notificationclick'
event.notification.close();
, event =&gt; {
const action = event.action;
const data = event.notification.data;
if (action ===
event.waitUntil(
'view') {
clients.openWindow('/dashboard')
);
} else if (action ===
'dismiss') {
// Just close the notification
return;
} else {
// Default action - open dashboard
event.waitUntil(
clients.openWindow('/dashboard')
);
}
});
// Background Sync Handler
self.addEventListener('sync'
, event =&gt; {
console.log('Service Worker: Background sync triggered:'
, event.tag);
if (event.tag ===
'background-metrics-sync') {
event.waitUntil(syncMetrics());
}
});
// Sync metrics when back online
async function syncMetrics() {
try {
// Get cached offline data
const cache = await caches.open(DYNAMIC
_
CACHE);
const cachedRequests = await cache.keys();
// Send queued data to server
for (const request of cachedRequests) {
if (request.url.includes('/api/v1/metrics')) {
try {
await fetch(request);
} catch (error) {
console.log('Service Worker: Failed to sync metrics:'
, error)
}
}
}
console.log('Service Worker: Metrics sync completed');
} catch (error) {
console.error('Service Worker: Background sync failed:'
, error);
}
}
