self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    if (!requestUrl.pathname.includes("cache")) {
        console.log(`Bypassing cache for image: ${requestUrl.pathname}`);
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
    }
});