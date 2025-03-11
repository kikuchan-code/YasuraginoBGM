const CACHE_NAME = "yasuragi-bgm-cache-v7"; // キャッシュ名変更（更新時はバージョンアップ）
const BASE_URL = self.location.origin + "/YasuraginoBGM"; // GitHub Pages 用にフルパス

const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/favicon.ico`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/style.css`,
    `${BASE_URL}/script.js`,
    `${BASE_URL}/manifest.json`,
    `${BASE_URL}/BGM/Nodoka.mp3`,
    `${BASE_URL}/BGM/Night_Jazz_Piano_Instrumental_Music.mp3`,
    `${BASE_URL}/BGM/Natural_Sonic_guiter.mp3`,
    `${BASE_URL}/BGM/inaka.mp3`,
    `${BASE_URL}/Nature/takibi.mp3`,
    `${BASE_URL}/Nature/rain.mp3`,
    `${BASE_URL}/Nature/seseragi.mp3`,
    `${BASE_URL}/Nature/saezuri.mp3`,
    `${BASE_URL}/Nature/musinokoe.mp3`,
    `${BASE_URL}/alarm/ainoaisatsu.mp3`,
    `${BASE_URL}/alarm/otomenoinori.mp3`,
    `${BASE_URL}/alarm/komoriuta.mp3`,
    `${BASE_URL}/alarm/canon.mp3`,
    `${BASE_URL}/alarm/hotarunohikari.mp3`,
    `${BASE_URL}/alarm/hananowarutu.mp3`,
    `${BASE_URL}/img/icon-192x192.png`,
    `${BASE_URL}/img/icon-512x512.png`,
    `${BASE_URL}/screenshots/screenshot_mobile.png`,
    `${BASE_URL}/screenshots/screenshot_pc.png`,
];

self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Fetching and caching files...");
            return Promise.allSettled(
                urlsToCache.map(url =>
                    fetch(url, { mode: "cors" })
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                            return cache.put(url, response.clone());
                        })
                        .catch(error => console.warn(`Failed to fetch ${url}:`, error))
                )
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            console.log("Old caches deleted.");
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((response) => {
                    if (!event.request.url.startsWith("http") || event.request.method !== "GET") {
                        return response;
                    }
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    if (event.request.destination === "audio") {
                        return caches.match(`${BASE_URL}/BGM/Nodoka.mp3`);
                    } else if (event.request.destination === "document") {
                        return caches.match(`${BASE_URL}/index.html`);
                    }
                });
        })
    );
});