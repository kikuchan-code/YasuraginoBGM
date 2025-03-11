const CACHE_NAME = 'bgm-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/BGM/Nodoka.mp3',
    '/BGM/Night_Jazz_Piano_Instrumental_Music.mp3',
    '/BGM/Natural_Sonic_guiter.mp3',
    '/BGM/inaka.mp3',
    './Nature/takibi.mp3',
    './Nature/rain.mp3',
    './Nature/seseragi.mp3',
    './Nature/saezuri.mp3',
    './Nature/musinokoe.mp3',
    './alarm/ainoaisatsu.mp3',
    './alarm/otomenoinori.mp3',
    './alarm/komoriuta.mp3',
    './alarm/canon.mp3',
    './alarm/hotarunohikari.mp3',
    './alarm/hananowarutu.mp3',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install the service worker and cache the required files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate the service worker and delete outdated caches
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

// Fetch the files from cache or network
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
