const CACHE_NAME = 'run-sun-v1';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './clock.mp3',
  './dead.mp3',
  './ding-101492.mp3',
  './don-1.MP3',
  './fault.mp3',
  './jump.mp3',
  './jumpp.mp3',
  './l1.mp3',
  './l2.mp3',
  './l3.mp3',
  './l4.mp3',
  './l5.mp3',
  './l6.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key)))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
