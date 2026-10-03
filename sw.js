/* Hymn of Ash servis işçisi — sürüm 4caf13a6ad8f (pwa-kur.js üretir; elle düzenleme) */
const ONBELLEK = "ashfall-4caf13a6ad8f";
const AG_ONCE = ["./", "index.html", "kasa.json", "oyun.bin"];
const DOSYALAR = AG_ONCE.concat(["manifest.webmanifest", "ikon-180.png", "ikon-192.png", "ikon-512.png", "ikon-maskable-512.png"]);
self.addEventListener("install", e => { e.waitUntil(caches.open(ONBELLEK).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== ONBELLEK).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  const ad = u.pathname.slice(u.pathname.lastIndexOf("/") + 1), anahtar = ad === "" ? "index.html" : ad;
  if (r.mode === "navigate" || AG_ONCE.indexOf(anahtar) >= 0) {   /* ağ önce: çevrimiçiyken son sürüm; çevrimdışı önbellek */
    e.respondWith(fetch(r, { cache: "no-store" }).then(y => { if (y.ok) { const k = y.clone(); caches.open(ONBELLEK).then(c => c.put(anahtar, k)); } return y; })
      .catch(() => caches.match(anahtar).then(y => y || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(r).then(y => y || fetch(r)));
});
