import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='build/client';
const assets=(await readdir(root+'/assets')).filter(f=>/\.(js|css)$/.test(f)).map(f=>'/assets/'+f);
const html=await readFile(root+'/index.html','utf8');
const version=createHash('sha256').update(html+assets.join(',')).digest('hex').slice(0,16);
const paths=['/','/index.html',...assets];
await writeFile(root+'/sw.js',`
const CACHE='lifebuckets-shell-${version}';
const PATHS=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PATHS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('lifebuckets-shell-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(!PATHS.includes(url.pathname))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const hit=await cache.match(url.pathname);
  return hit||fetch(event.request);
 }));
});
`);
console.log('Public app shell generated: '+version);
