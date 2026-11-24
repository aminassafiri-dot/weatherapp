const CACHE = 'weather-shell-v1';
const SHELL = ['./weather1.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(response => { if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('./weather1.html', copy)); } return response; }).catch(() => caches.match('./weather1.html')));
  } else if (SHELL.some(path => new URL(path, self.registration.scope).href === req.url)) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
  }
});
