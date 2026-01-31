// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

// ensure only register in production builds and attempt to remove old/stale workers
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // SW won't work if PUBLIC_URL is on different origin
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      // try unregistering stale service workers first (helps when changing caching logic)
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => {
          // only unregister workers that are not the app's current script
          if (r.active && r.active.scriptURL.indexOf(swUrl) === -1) {
            r.unregister();
          }
        });
      }).catch(() => {});

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          if (registration.waiting) {
            // auto-skip waiting for updates
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; execute callback
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch(() => {});
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}
