/* じぶんドリル service worker — offline cache */
const VERSION = 'jibun-drill-v2';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png',
  './packs/index.js', './packs/e2/math.js', './packs/e2/calc.js', './packs/e2/kanji.js', './packs/j1/math.js', './packs/j1/calc.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page and the packs: newest version when online, cached copy when not.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.indexOf('/packs/') >= 0) {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))));
    return;
  }
  if (isFont(url) || url.origin === location.origin) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => r)));
  }
});
