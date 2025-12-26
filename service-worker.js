const CACHE_NAME = 'crypto-tracker-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== 'crypto-cache-v1') {
                        console.log('Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Estrategia: Network First para API, Cache First para assets
    if (url.hostname === 'api.coingecko.com' || url.hostname.endsWith('.coingecko.com')) {
        // Network First para datos de API
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clonar la respuesta porque solo se puede leer una vez
                    const responseClone = response.clone();
                    
                    // Guardar en caché para uso offline
                    caches.open('crypto-cache-v1').then((cache) => {
                        cache.put(request, responseClone);
                    });
                    
                    return response;
                })
                .catch(() => {
                    // Si falla la red, intentar desde caché
                    return caches.match(request);
                })
        );
    } else {
        // Cache First para assets locales
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Si no está en caché, obtener de la red
                    return fetch(request).then((response) => {
                        // Guardar en caché para futuras peticiones
                        if (request.method === 'GET') {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        
                        return response;
                    });
                })
        );
    }
});
