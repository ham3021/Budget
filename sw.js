const VERSION = '20260612f';
const CACHE = 'budget-' + VERSION;

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebasejs') || 
      e.request.url.includes('googleapis') ||
      e.request.url.includes('api.anthropic.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request, {cache: 'no-cache'})
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
