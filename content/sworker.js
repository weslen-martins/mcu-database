const staticCacheName = 'mcu-2019-06-v01';

const filesToCache = [
  '/',
  '/movies/',
  '/movies/the-avengers-iv/',
  '/movies/captain-marvel/',
  '/timeline/',
  '/universe/',
  '/offline/index.html',
  '/css/main.min.css',
  '/js/main.min.js',
  '/images/logo-marvel-studios.png',
  '/images/cloud-off.svg',
  '/images/bg-header.jpg'
];

// Cache on install
this.addEventListener("install", event => {
  this.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
    })
  )
});

// Clear cache on activate
this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('mcu-2019-')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Serve from Cache
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline/index.html');
      })
  )
});