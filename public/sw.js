const SHELL = "keel-static-v1";

function mayCache(url, request) {
  if (request.method !== "GET") return false;
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/api/")) return false;
  const cacheControl = "";
  if (/no-store|private/i.test(cacheControl)) return false;
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/pcm-worklet.js" ||
    url.pathname === "/manifest.webmanifest"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== SHELL).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (!mayCache(url, event.request)) return;
  event.respondWith(
    caches.open(SHELL).then(async (cache) => {
      const hit = await cache.match(event.request);
      if (hit) return hit;
      const response = await fetch(event.request);
      const cacheControl = response.headers.get("cache-control") || "";
      if (response.ok && !response.headers.has("set-cookie") && !/no-store|private/i.test(cacheControl)) {
        cache.put(event.request, response.clone());
      }
      return response;
    }),
  );
});
