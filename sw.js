const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/images-cache/one.jpg',
    '/images-cache/two.jpg',
    '/images-cache/three.jpg',
    '/images-cache/four.jpg',
    '/images-cache/five.jpg',
    '/images-webp-cache/one.webp',  // Assuming you want webp images cached
    '/images-webp-cache/two.webp',
    '/images-webp-cache/three.webp',
    '/images-webp-cache/four.webp',
    '/images-webp-cache/five.webp',
];

// Install event - Cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return Promise.all(urlsToCache.map((url) => {
                    return fetch(url).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to cache ${url}: ${response.statusText}`);
                        }
                        return cache.put(url, response);  // Cache the response directly
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

    // Exclude caching for requests containing "images" but not "cache"
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
                    // Cache the network response for future use
                    return caches.open(CACHE_NAME).then((cache) => {
                        if (requestUrl.pathname.includes('images')) {
                            // Do not cache images that are not in the cache directory
                            return networkResponse;  // Return network response without caching
                        }
                        cache.put(event.request, networkResponse.clone());  // Cache the new response
                        return networkResponse;  // Return the fetched response
                    });
                });
            })
            .catch((error) => {
                console.error('Fetch failed; returning offline page instead.', error);
                // You could return a fallback page or image here if needed
            })
    );
});