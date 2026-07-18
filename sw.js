const CACHE = 'mythlings-v11';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg',
  'assets/dragon/idle.png', 'assets/dragon/happy.png', 'assets/dragon/sad.png',
  'assets/dragon/sleep.png', 'assets/dragon/walk1.png', 'assets/dragon/walk2.png',
  'assets/dragon/walk3.png', 'assets/dragon/fire.png', 'assets/dragon/pounce.png'];

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
