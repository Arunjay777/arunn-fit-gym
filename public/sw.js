const CACHE_NAME = "fitx-cache-v2";
const ASSETS_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json",
  "pwa_icon_192.png",
  "pwa_icon_512.png"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("Failed to cache pre-defined offline assets:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Interceptor: Network-First Strategy to avoid blank screens with updating asset hashes
self.addEventListener("fetch", (event) => {
  // Only intercept HTTP/S requests
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If we got a valid response, cache it dynamically for offline fallback
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic" &&
          (event.request.url.includes(".js") || 
           event.request.url.includes(".css") || 
           event.request.url.includes(".png") || 
           event.request.url.endsWith("/") ||
           event.request.url.includes("index.html"))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Safe offline fallback: serve from cache if network fails
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Default offline index fallback
          return caches.match("./");
        });
      })
  );
});
