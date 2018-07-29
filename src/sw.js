let staticCacheName = 'restaurant-reviews-v1';
let imageCache = 'restaurant-reviews-gcache-v1'
let allCaches = [
    staticCacheName,
    imageCache
];

const urlsToCache = [
    './index.html', 
    './restaurant.html', 
    './manifest.json', 
    './sw.js',
    './css/main.css', 
    './img/1.webp', 
    './img/2.webp', 
    './img/3.webp', 
    './img/4.webp', 
    './img/5.webp', 
    './img/6.webp', 
    './img/7.webp', 
    './img/8.webp', 
    './img/9.webp', 
    './img/10.webp',
    './img/icon128.png',
    './img/icon512.png',
    './js/dbhelper.js', 
    './js/main.js', 
    './js/restaurant_info.js', 
    './js/idb.js'
];

/* Install service worker and cache files */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

/* Attempt to fetch OR fallback to network */
self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            let fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();
                    caches.open(staticCacheName)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('restaurant-reviews-') && 
                              !allCaches.includes(cacheName)
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('message', event => {
    if (event.data.action == 'skipWaiting') {
        self.skipWaiting();
    }
});
