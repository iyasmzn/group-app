self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
})

self.addEventListener('fetch', (event) => {
  // contoh cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
