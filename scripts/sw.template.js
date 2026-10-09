// Service worker do Sinapse: app abre sem internet; cards novos chegam quando há rede.
const APP = 'sinapse-app-__VERSION__';
const DATA = 'sinapse-data';
const FONTS = 'sinapse-fonts';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './content/cards.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP).then((c) => c.addAll(SHELL)).then(() => caches.open(FONTS)).then((c) => c.add('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-asm.js').catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sinapse-app-') && k !== APP).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rede primeiro (com limite de tempo), cache se falhar: usado para os cards do dia.
async function networkFirst(req, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  try {
    const res = await Promise.race([
      fetch(req, { cache: 'no-cache' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs)),
    ]);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(req, { ignoreSearch: true })) || (await caches.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    throw err;
  }
}

// Cache primeiro, atualiza em segundo plano: usado para o próprio app.
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch: true });
  const net = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || (await cache.match('./index.html')) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (url.pathname.endsWith('/content/cards.json')) e.respondWith(networkFirst(req, DATA, 5000));
    else if (req.mode === 'navigate') e.respondWith(networkFirst(new Request('./index.html'), APP, 4000));
    else e.respondWith(staleWhileRevalidate(req, APP));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || (url.hostname === 'cdnjs.cloudflare.com' && url.pathname.includes('/sql.js/'))) {
    e.respondWith(caches.open(FONTS).then(async (c) => (await c.match(req)) || fetch(req).then((res) => { c.put(req, res.clone()); return res; })));
  }
});
