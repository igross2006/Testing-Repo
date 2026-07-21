const CACHE = 'mythlings-v30';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg',
  'assets/bg/meadow-sunny.webp', 'assets/bg/meadow-rainy.webp', 'assets/bg/meadow-snowy.webp',
  'assets/bg/cove-sunny.webp', 'assets/bg/cavern.webp', 'assets/bg/ember.webp', 'assets/bg/grove.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
