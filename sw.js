/* じぶんドリル service worker — offline cache */
const VERSION = 'jibun-drill-v9';
const CORE = [
  './index.html', './config.js', './manifest.webmanifest', './icon-192.png',
  './icon-512.png', './icon-180.png', './img/cheer-frame.webp', './img/fx-levelup.webp',
  './img/fx-medal.webp', './img/medal-allclear1.webp', './img/medal-allclear7.webp', './img/medal-big1.webp',
  './img/medal-card1.webp', './img/medal-first.webp', './img/medal-goal7.webp', './img/medal-lessons5.webp',
  './img/medal-master1.webp', './img/medal-master10.webp', './img/medal-master5.webp', './img/medal-mates3.webp',
  './img/medal-morning7.webp', './img/medal-oks10.webp', './img/medal-perfect1.webp', './img/medal-perfect10.webp',
  './img/medal-quest1.webp', './img/medal-s10.webp', './img/medal-s100.webp', './img/medal-s50.webp',
  './img/medal-scan1.webp', './img/medal-streak3.webp', './img/medal-streak30.webp', './img/medal-streak7.webp',
  './img/medal-weak10.webp', './img/medal-weakwin.webp', './img/medal-week1.webp', './img/omi-cake.webp',
  './img/omi-clover.webp', './img/omi-hanamaru.webp', './img/omi-music.webp', './img/omi-rainbow.webp',
  './img/omi-star.webp', './img/rank-1.webp', './img/rank-2.webp', './img/rank-3.webp',
  './img/rank-4.webp', './img/rank-5.webp', './img/rank-6.webp', './img/rank-7.webp',
  './img/room-bg.webp', './img/splash.webp', './img/win-day.webp', './img/win-evening.webp',
  './img/win-morning.webp', './img/win-night.webp', './packs/index.js', './packs/e2/math.js',
  './packs/e2/calc.js', './packs/e2/kanji.js', './packs/j1/math.js', './packs/j1/calc.js'];

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

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdn.jsdelivr.net';

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page and the packs: newest version when online, cached copy when not.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.indexOf('/packs/') >= 0 || url.pathname.endsWith('/config.js')) {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))));
    return;
  }
  if (isFont(url) || url.origin === location.origin) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; }).catch(() => r)));
  }
});
