# PWA - Testing and Installation

This React app has been configured as a Progressive Web App (PWA).

Features added:
- Service worker (Workbox) registered to precache static assets and runtime-cache API responses for `/api/products`.
- Web App Manifest (`public/manifest.json`) with icons and theme color.
- Offline fallback page at `/offline.html` served when navigation fails.
- Installation support (display: standalone) for mobile and desktop.

How to run locally
1. Start backend (if using local API):

```bash
cd '/home/jarvis/Documents/PWA /server'
npm install
npm start
```

2. Start frontend:

```bash
cd '/home/jarvis/Documents/PWA /client'
npm install
npm start
```

Building for production (to test real PWA behavior)

```bash
cd '/home/jarvis/Documents/PWA /client'
npm run build
# Serve the build folder (for example using serve)
npm install -g serve
serve -s build -l 5000
```

Testing offline and installation

1. Open the app served from `serve` (or a production server) in Chrome.
2. Open DevTools -> Application:
   - Under "Manifest" you should see the app name, icons, and the "Add to home screen" / "Install" option.
   - Under "Service Workers" you should see the registered service worker and the scope.
3. To test offline:
   - In DevTools -> Network, set "Offline" or throttle to "Offline" and refresh the page.
   - The app should still load (static assets are precached). Navigation should fall back to `/offline.html` when an online request fails.
   - API responses previously cached (GET /api/products) will be served from cache if available.
    - Cache lifecycle: the service worker uses a two-stage API cache scheme:
       - `api-cache-0` is created on the first successful fetch of `/api/products` (initial cache).
       - On a subsequent successful fetch the worker promotes the data to `api-cache-1` (the promoted cache).
       - When offline the worker will prefer `api-cache-1` if present, otherwise fall back to `api-cache-0`.
       - This promotion strategy ensures an initial cached copy is available quickly, and a promoted stable cache is used afterwards.
4. To test installability:
   - On desktop, use the install icon in the address bar or in Chrome menu -> "Install app".
   - On mobile (Chrome Android), the browser will prompt to add to the home screen when criteria are met.

Notes & Caveats
- Service worker registration only runs in `production` builds by default. Running `npm start` (CRA dev server) will not register the production service worker.
- API caching is implemented for GET requests containing `/api/products`. If your API has different routes, update `src/service-worker.js` accordingly.
- For full offline CRUD you would need to implement background sync or local-first storage. Current implementation caches GET responses and serves cached data when offline.

