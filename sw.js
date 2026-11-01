const CACHE_NAME = 'the-attic-v2-1';
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './pixel-world.js',
  './manifest.webmanifest',
  './assets/icon-180.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request).then(net => {
    if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
      const copy = net.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return net;
  }).catch(() => caches.match('./index.html'))));
});
