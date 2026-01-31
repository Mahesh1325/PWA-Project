/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

clientsClaim();
self.skipWaiting();

/* =======================
   PRECACHE BUILD FILES
======================= */
precacheAndRoute(self.__WB_MANIFEST);

/* =======================
   APP SHELL ROUTING
======================= */
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

/* =======================
   STATIC ASSETS CACHE
======================= */
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'static-assets',
  })
);

/* =======================
   PRODUCTS API CACHE
   GET /api/products
   Strategy: Network First
======================= */
registerRoute(
  ({ request, url }) =>
    request.method === 'GET' &&
    url.pathname.startsWith('/api/products'),

  new NetworkFirst({
    cacheName: 'products-api-cache',
    networkTimeoutSeconds: 5, // fallback after 5s
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

/* =======================
   NEVER CACHE MUTATIONS
======================= */
registerRoute(
  ({ request, url }) =>
    url.pathname.startsWith('/api/products') &&
    request.method !== 'GET',
  async ({ request }) => fetch(request)
);

/* =======================
   CLEAN OLD CACHES
======================= */
self.addEventListener('activate', (event) => {
  const allowedCaches = [
    'static-assets',
    'products-api-cache',
  ];

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key) && !key.startsWith('workbox')) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

/* =======================
   SKIP WAITING SUPPORT
======================= */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
