import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve('build/client');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try {
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/api/chatkit'||pathname.startsWith('/api/chatkit/')){
  const upstream=http.request({hostname:'127.0.0.1',port:8001,path:req.url,method:req.method,headers:{...req.headers,host:'127.0.0.1:8001'}},reply=>{res.writeHead(reply.statusCode||502,{...reply.headers,'cache-control':'no-store'});reply.pipe(res)});
  upstream.on('error',()=>{if(!res.headersSent)res.writeHead(503,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({error:'Assistant is unavailable. Start the local chat server.'}))});
  res.on('close',()=>upstream.destroy());req.pipe(upstream);return;
 }
 const file=resolve(root,'.'+(pathname==='/'||pathname==='/assistant'?'/index.html':pathname));
 if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
 let data;try{data=await readFile(file)}catch{res.writeHead(404).end('Not found');return}
 res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');
 res.setHeader('Cache-Control','no-cache');res.end(data);
 }catch{res.writeHead(500).end('Server error')}
});
server.listen(4173,'127.0.0.1',()=>console.log('Review: http://127.0.0.1:4173'));
