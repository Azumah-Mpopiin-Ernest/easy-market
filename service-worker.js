const CACHE_NAME = "easymarket-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.jsx",
  "/site.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon-96x96.png",
  "/favicon.ico",
  "/apple-touch-icon.png"
];

// Install SW → cache all static files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate SW → remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy: Cache, then network (with proper clone)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response immediately, update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {
            // Ignore network errors
          });
        return cachedResponse;
      }

      // If not cached, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Optional: return fallback page for offline
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
