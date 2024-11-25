const CACHE_NAME = 'liquorish-site-v1';
const CACHE_ASSETS = [
  '/', 
  '/logo.jpeg',
  '/jude.png',
  '/oliver.png',
  '/james.png',
  '/favicon.ico',
  '/apple-icon.png',
  '/android-icon.png',
  'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap',
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/'))
  );
});
