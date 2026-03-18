const CACHE="quran-cache-v1000";
self.addEventListener("install",e=>{self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html","./style.css","./app.js"])));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(names=>Promise.all(names.map(n=>{if(n!==CACHE) return caches.delete(n);}))))});
self.addEventListener("fetch",e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
