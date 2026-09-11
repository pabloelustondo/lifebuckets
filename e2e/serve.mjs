import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=resolve('build/client');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try {
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+'/')){res.writeHead(403).end();return}
 let data;try{data=await readFile(file)}catch{res.writeHead(404).end('Not found');return}
 res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');
 res.setHeader('Cache-Control','no-cache');res.end(data);
 }catch{res.writeHead(500).end('Server error')}
});
server.listen(4173,'127.0.0.1',()=>console.log('Review: http://127.0.0.1:4173'));
