self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // 👉 Jangan cache API/data calls
  if (url.pathname.startsWith('/api') || url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request))
    return
  }

  // 👉 Cache-first hanya untuk static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
