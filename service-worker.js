const CACHE_NAME = 'liquorish-site-v3';
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

self.addEventListener('fetch', (event) => {
    // Skip requests for external resources like Lite YouTube
    if (event.request.url.includes('lite-yt-embed')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
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
