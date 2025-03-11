const CACHE_NAME = 'yasuragi-bgm-cache-v1'; // ← CACHE_NAME を定義

const BASE_URL = '/YasuraginoBGM'; // GitHub Pages のリポジトリ名
const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/favicon.ico`,
    `${BASE_URL}/index.html`,
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
    self.skipWaiting(); // すぐに新しいSWを適用
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // 新しい SW をすぐ適用
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
    );
});
