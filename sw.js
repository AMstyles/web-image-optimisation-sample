const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    './', // cache the homepage
    './images-cache/one.jpg',
    './images-cache/two.jpg',
    './images-cache/three.jpg',
    './images-cache/four.jpg',
    './images-cache/five.jpg',
    './images-webp-cache/one.jpg',
    './images-webp-cache/two.jpg',
    './images-webp-cache/three.jpg',
    './images-webp-cache/four.jpg',
    './images-webp-cache/five.jpg',
];

// Install event - Cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // Adding error handling for each URL
                return cache.addAll(urlsToCache.map((url) => {
                    return fetch(url).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to cache ${url}: ${response.statusText}`);
                        }
                        return url;
                    });
                }));
            })
            .catch((error) => {
                console.error('Failed to cache resources:', error);
            })
    );
});

// Fetch event - Control cache behavior
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Exclude caching for URLs containing "images" but not "cache"
    if (requestUrl.pathname.includes('images') && !requestUrl.pathname.includes('cache')) {
        console.log(`Skipping cache for: ${requestUrl}`);
        return event.respondWith(fetch(event.request));
    }

    // Handle caching logic for other requests
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Fetch from network if not cached
                return fetch(event.request).then((networkResponse) => {
                    // Optionally, cache the network response if it doesn't contain "images"
                    if (!requestUrl.pathname.includes('images')) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                });
            })
    );
});