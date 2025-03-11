const CACHE_NAME = 'yasuragi-bgm-cache-v1'; // ← CACHE_NAME を定義

const BASE_URL = '/YasuraginoBGM'; // GitHub Pages のリポジトリ名
const urlsToCache = [
    `${BASE_URL}/`,
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
    `${BASE_URL}/icons/icon-192x192.png`,
    `${BASE_URL}/icons/icon-512x512.png`,
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to cache', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
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
