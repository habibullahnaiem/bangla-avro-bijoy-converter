const VERSION = "avrojoy-offline-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const OFFLINE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/manus-storage/bangla-converter-exact-reference-logo_2f0bb0ec.png",
  "/manus-storage/avrojoy-hero-v2-banner_b1dad7f4.png",
  "/manus-storage/bangla-converter-keyboard-background_fad26d5c.png",
  "/manus-storage/avrojoy-bengali-glyph-ribbon_f006d975.png",
  "/manus-storage/SutonnyMJ_danDi_v2_5618afeb.ttf",
  "/manus-storage/hind-siliguri-400_9d724dcd.ttf",
  "/manus-storage/hind-siliguri-500_ba0a720c.ttf",
  "/manus-storage/hind-siliguri-600_b9cb6e1f.ttf",
  "/manus-storage/hind-siliguri-700_6c90ad0b.ttf",
  "/manus-storage/noto-serif-bengali-700_c2fbc861.ttf",
  "/manus-storage/noto-serif-bengali-900_1c3eac55.ttf",
  /* @vite-build-assets */
];

async function cacheAsset(cache, url) {
  try {
    const request = new Request(url, { cache: "reload", mode: "no-cors" });
    const response = await fetch(request);
    if (response.ok || response.type === "opaque") {
      await cache.put(url, response);
    }
  } catch {
    // A single unavailable decorative asset must not block offline app setup.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(async (cache) => {
      await Promise.all(OFFLINE_ASSETS.map((url) => cacheAsset(cache, url)));
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isStorageAsset = isSameOrigin && url.pathname.startsWith("/manus-storage/");

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(async () => (await caches.match("/index.html")) || (await caches.match("/"))),
    );
    return;
  }

  if (isStorageAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
    return;
  }

  if (isSameOrigin && ["script", "style", "font", "image"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      }),
    );
  }
});
