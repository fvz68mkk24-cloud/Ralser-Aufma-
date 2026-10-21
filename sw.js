const CACHE='ralser-aufmass-offline-v8-11';
const ASSETS=['./','./index.html','./manifest.webmanifest','./model.js','./app.js','./logo-ralser.jpg'];
// Activate only after every offline file has been downloaded successfully.
// Open forms are never reloaded automatically; localStorage is not modified here.
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting());});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('ralser-aufmass-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(req.mode==='navigate'?'./index.html':req);return cached||fetch(req);}));});
