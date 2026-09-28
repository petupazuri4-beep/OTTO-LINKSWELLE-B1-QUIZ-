const CACHE_NAME = 'linkswelle-b1-v5';

// Core shell assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html'
];

// Install: Precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching app shell...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-cache non-critical warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Smart caching for offline access
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests
  if (req.method !== 'GET') {
    return;
  }

  // 1. Navigation requests (HTML page loads / reloads while offline)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline: serve cached index.html or root
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline - Linkswelle</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>Sie sind offline</h2><p>Die App wird aus dem Speicher geladen...</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Google Fonts or External Static CDN assets
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  // 3. API requests: Try network, if offline return informative JSON
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            error: 'Offline mode active. AI features require network connection, but local vocabulary and quizzes are fully available.'
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // 4. Same-origin Static Assets (JS, CSS, images, icons, sounds)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
  }
});
